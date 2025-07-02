from flask import Blueprint, request, jsonify
from db import get_connection

maquina_bp = Blueprint('maquina', __name__, url_prefix='/maquina')

# Obtener todas las máquinas
@maquina_bp.route('/', methods=['GET'])
def obtener_maquinas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Maquinas")
    maquinas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(maquinas)

# Crear nueva máquina
@maquina_bp.route('/', methods=['POST'])
def crear_maquina():
    data = request.get_json()
    modelo = data.get('modelo')
    marca = data.get('marca')
    capacidad_cafe = data.get('capacidad_cafe')
    capacidad_agua = data.get('capacidad_agua')
    costo_mensual_alquiler = data.get('costo_mensual_alquiler')
    porcentaje_ganancia_empresa = data.get('porcentaje_ganancia_empresa')
    estado = data.get('estado', False)

    if not all([modelo, marca, capacidad_cafe, capacidad_agua, costo_mensual_alquiler, porcentaje_ganancia_empresa]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO Maquinas (modelo, marca, capacidad_cafe, capacidad_agua, costo_mensual_alquiler, porcentaje_ganancia_empresa, estado) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (modelo, marca, capacidad_cafe, capacidad_agua, costo_mensual_alquiler, porcentaje_ganancia_empresa, estado))
        conn.commit()
        return jsonify({'mensaje': 'Máquina creada correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Actualizar máquina existente
@maquina_bp.route('/<int:id_maquina>', methods=['PUT'])
def actualizar_maquina(id_maquina):
    data = request.get_json()
    modelo = data.get('modelo')
    marca = data.get('marca')
    capacidad_cafe = data.get('capacidad_cafe')
    capacidad_agua = data.get('capacidad_agua')
    costo_mensual_alquiler = data.get('costo_mensual_alquiler')
    porcentaje_ganancia_empresa = data.get('porcentaje_ganancia_empresa')
    estado = data.get('estado')

    if not all([modelo, marca, capacidad_cafe, capacidad_agua, costo_mensual_alquiler, porcentaje_ganancia_empresa]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    # Validar y convertir el campo estado
    if isinstance(estado, str):
        if estado.lower() in ['true', '1']:
            estado = True
        elif estado.lower() in ['false', '0']:
            estado = False
        else:
            return jsonify({'error': 'Valor de estado inválido'}), 400
    elif isinstance(estado, int):
        estado = bool(estado)
    elif not isinstance(estado, bool):
        return jsonify({'error': 'Valor de estado inválido'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Maquinas 
            SET modelo = %s, marca = %s, capacidad_cafe = %s, capacidad_agua = %s, 
                costo_mensual_alquiler = %s, porcentaje_ganancia_empresa = %s, estado = %s 
            WHERE id_maquina = %s
        """, (modelo, marca, capacidad_cafe, capacidad_agua, costo_mensual_alquiler, porcentaje_ganancia_empresa, estado, id_maquina))
        if cursor.rowcount == 0:
            # Verificar si la máquina existe
            cursor.execute("SELECT 1 FROM Maquinas WHERE id_maquina = %s", (id_maquina,))
            if cursor.fetchone():
                return jsonify({'mensaje': 'No hubo cambios en la máquina'}), 200
            else:
                return jsonify({'error': 'Máquina no encontrada'}), 404
        conn.commit()
        return jsonify({'mensaje': 'Máquina actualizada correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Eliminar máquina
@maquina_bp.route('/<int:id_maquina>', methods=['DELETE'])
def eliminar_maquina(id_maquina):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Maquinas WHERE id_maquina = %s", (id_maquina,))
        if cursor.rowcount == 0:
            return jsonify({'error': 'Máquina no encontrada'}), 404
        conn.commit()
        return jsonify({'mensaje': 'Máquina eliminada correctamente'})
    except Exception as e:
        conn.rollback()
        error_msg = str(e)
        if 'foreign key constraint' in error_msg.lower():
            return jsonify({'error': 'No se puede eliminar una máquina que tiene alquileres asociados'}), 400
        return jsonify({'error': error_msg}), 400
    finally:
        cursor.close()
        conn.close()

# Obtener máquina por ID
@maquina_bp.route('/<int:id_maquina>', methods=['GET'])
def obtener_maquina(id_maquina):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Maquinas WHERE id_maquina = %s", (id_maquina,))
    maquina = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if maquina:
        return jsonify(maquina)
    else:
        return jsonify({'error': 'Máquina no encontrada'}), 404

# Obtener máquinas alquiladas
@maquina_bp.route('/alquiladas', methods=['GET'])
def obtener_maquinas_alquiladas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Maquinas WHERE estado = TRUE")
    maquinas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(maquinas)

# Obtener máquinas disponibles (no alquiladas)
@maquina_bp.route('/disponibles', methods=['GET'])
def obtener_maquinas_disponibles():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Maquinas WHERE estado = FALSE")
    maquinas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(maquinas)

# Obtener máquinas alquiladas por cliente
@maquina_bp.route('/cliente/<int:id_cliente>', methods=['GET'])
def obtener_maquinas_por_cliente(id_cliente):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT m.*, c.nombre_empresa, a.fecha_inicio, a.fecha_fin 
        FROM Maquinas m 
        JOIN Alquileres a ON m.id_maquina = a.id_maquina 
        JOIN Clientes c ON a.id_cliente = c.id_cliente 
        WHERE c.id_cliente = %s AND m.estado = TRUE
    """, (id_cliente,))
    maquinas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(maquinas)

# Obtener máquinas con sus cafés disponibles
@maquina_bp.route('/con-cafes', methods=['GET'])
def obtener_maquinas_con_cafes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT m.*, GROUP_CONCAT(c.nombre_cafe) as cafes_disponibles 
        FROM Maquinas m 
        LEFT JOIN MaquinaCafes mc ON m.id_maquina = mc.id_maquina 
        LEFT JOIN Cafes c ON mc.id_cafe = c.id_cafe 
        GROUP BY m.id_maquina
    """)
    maquinas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(maquinas)

# Obtener máquinas con sus cafés disponibles en detalle
@maquina_bp.route('/con-cafes-detalle', methods=['GET'])
def obtener_maquinas_con_cafes_detalle():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Maquinas")
    maquinas = cursor.fetchall()
    # Para cada máquina, obtener sus cafés asociados
    for maquina in maquinas:
        cursor.execute('''
            SELECT c.id_cafe, c.nombre_cafe
            FROM Cafes c
            JOIN MaquinaCafes mc ON c.id_cafe = mc.id_cafe
            WHERE mc.id_maquina = %s
        ''', (maquina['id_maquina'],))
        cafes = cursor.fetchall()
        maquina['cafes'] = cafes
    cursor.close()
    conn.close()
    return jsonify(maquinas)

# Actualizar cafés de una máquina
@maquina_bp.route('/<int:id_maquina>/cafes', methods=['PUT'])
def actualizar_cafes_maquina(id_maquina):
    data = request.get_json()
    cafes = data.get('cafes', [])
    # Validar duplicados
    if len(cafes) != len(set(cafes)):
        return jsonify({'error': 'No se permiten cafés duplicados en la lista.'}), 400
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Validar existencia de la máquina
        cursor.execute("SELECT 1 FROM Maquinas WHERE id_maquina = %s", (id_maquina,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({'error': 'Máquina no encontrada'}), 404
        # Validar existencia de todos los cafés
        if cafes:
            formato = ','.join(['%s'] * len(cafes))
            cursor.execute(f"SELECT id_cafe FROM Cafes WHERE id_cafe IN ({formato})", tuple(cafes))
            cafes_encontrados = {row[0] for row in cursor.fetchall()}
            cafes_faltantes = set(cafes) - cafes_encontrados
            if cafes_faltantes:
                cursor.close()
                conn.close()
                return jsonify({'error': f'Cafés no encontrados: {list(cafes_faltantes)}'}), 400
        # Eliminar todas las asociaciones actuales
        cursor.execute("DELETE FROM MaquinaCafes WHERE id_maquina = %s", (id_maquina,))
        # Insertar las nuevas asociaciones
        for id_cafe in cafes:
            cursor.execute("INSERT INTO MaquinaCafes (id_maquina, id_cafe) VALUES (%s, %s)", (id_maquina, id_cafe))
        conn.commit()
        return jsonify({'mensaje': 'Cafés de la máquina actualizados correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close() 