from flask import Blueprint, request, jsonify
from db import get_connection

maquinas_bp = Blueprint('maquinas', __name__, url_prefix='/maquinas')

# Obtener todas las máquinas
@maquinas_bp.route('/', methods=['GET'])
def listar_maquinas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Maquinas")
    resultados = cursor.fetchall()
    # Por cada máquina, obtener los cafés que puede producir
    for maquina in resultados:
        cursor.execute('''
            SELECT c.id_cafe, c.nombre_cafe, c.precio_venta, c.descripcion
            FROM MaquinaCafes mc
            JOIN Cafes c ON mc.id_cafe = c.id_cafe
            WHERE mc.id_maquina = %s
        ''', (maquina['id_maquina'],))
        cafes = cursor.fetchall()
        maquina['cafes'] = cafes
    cursor.close()
    conn.close()
    return jsonify(resultados)

# Crear nueva máquina
@maquinas_bp.route('', methods=['POST'])
def crear_maquina():
    data = request.json
    required_fields = ['modelo', 'marca', 'capacidad_cafe', 'capacidad_agua', 'costo_mensual_alquiler', 'porcentaje_ganancia_empresa']
    if not all(field in data and data[field] != '' for field in required_fields):
        return jsonify({'error': 'Faltan datos obligatorios'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    query = """
        INSERT INTO Maquinas (modelo, marca, capacidad_cafe, capacidad_agua, costo_mensual_alquiler, porcentaje_ganancia_empresa)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    valores = (
        data['modelo'],
        data['marca'],
        data['capacidad_cafe'],
        data['capacidad_agua'],
        data['costo_mensual_alquiler'],
        data['porcentaje_ganancia_empresa']
    )
    cursor.execute(query, valores)
    id_maquina = cursor.lastrowid
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Máquina creada correctamente', 'id_maquina': id_maquina}), 201

# Editar máquina existente
@maquinas_bp.route('/<int:id_maquina>', methods=['PUT'])
def actualizar_maquina(id_maquina):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    query = """
        UPDATE Maquinas
        SET modelo = %s,
            marca = %s,
            capacidad_cafe = %s,
            capacidad_agua = %s,
            costo_mensual_alquiler = %s,
            porcentaje_ganancia_empresa = %s
        WHERE id_maquina = %s
    """
    valores = (
        data.get('modelo'),
        data.get('marca'),
        data.get('capacidad_cafe'),
        data.get('capacidad_agua'),
        data.get('costo_mensual_alquiler'),
        data.get('porcentaje_ganancia_empresa'),
        id_maquina
    )
    cursor.execute(query, valores)
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Máquina actualizada correctamente'}), 200

# Eliminar una máquina
@maquinas_bp.route('/<int:id_maquina>', methods=['DELETE'])
def eliminar_maquina(id_maquina):
    conn = get_connection()
    cursor = conn.cursor()

    # Verificar si la máquina tiene alquileres asociados
    cursor.execute("SELECT COUNT(*) as count FROM Alquileres WHERE id_maquina = %s", (id_maquina,))
    result = cursor.fetchone()
    if result[0] > 0:
        cursor.close()
        conn.close()
        return jsonify({'error': 'No se puede eliminar una máquina que esta alquilada'}), 400

    # Eliminar registros de MaquinaCafes asociados a la máquina
    cursor.execute("DELETE FROM MaquinaCafes WHERE id_maquina = %s", (id_maquina,))
    
    # Eliminar la máquina
    cursor.execute("DELETE FROM Maquinas WHERE id_maquina = %s", (id_maquina,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Máquina eliminada correctamente'})

# Obtener máquinas no alquiladas
@maquinas_bp.route('/disponibles', methods=['GET'])
def listar_maquinas_disponibles():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Maquinas WHERE id_maquina NOT IN (SELECT id_maquina FROM Alquileres)")
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

# Obtener una máquina por su id
@maquinas_bp.route('/<int:id_maquina>', methods=['GET'])
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

# Actualizar cafés de una máquina
@maquinas_bp.route('/<int:id_maquina>/cafes', methods=['PUT'])
def actualizar_cafes_maquina(id_maquina):
    data = request.json
    nuevos_cafes = data.get('cafes', [])
    conn = get_connection()
    cursor = conn.cursor()
    # Eliminar cafés actuales
    cursor.execute('DELETE FROM MaquinaCafes WHERE id_maquina = %s', (id_maquina,))
    # Insertar los nuevos cafés
    for id_cafe in nuevos_cafes:
        cursor.execute('INSERT INTO MaquinaCafes (id_maquina, id_cafe) VALUES (%s, %s)', (id_maquina, id_cafe))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Cafés de la máquina actualizados correctamente'})

# Obtener máquinas alquiladas
@maquinas_bp.route('/alquiladas', methods=['GET'])
def maquinas_alquiladas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT DISTINCT m.id_maquina, m.modelo, m.marca
        FROM Alquileres a
        JOIN Maquinas m ON a.id_maquina = m.id_maquina
        WHERE a.fecha_fin IS NULL
    """
    cursor.execute(query)
    maquinas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(maquinas)
