from flask import Blueprint, request, jsonify
from db import get_connection
import bcrypt

cliente_bp = Blueprint('cliente', __name__, url_prefix='/cliente')


@cliente_bp.route('/maquinas/disponibles', methods=['GET'])
def maquinas_disponibles():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM Maquinas
        WHERE id_maquina NOT IN (
            SELECT id_maquina FROM Alquileres
        )
    """
    cursor.execute(query)
    maquinas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(maquinas)


@cliente_bp.route('/alquileres', methods=['POST'])
def crear_alquiler():
    data = request.json
    id_cliente = data.get('id_cliente')
    id_maquina = data.get('id_maquina')
    fecha_inicio = data.get('fecha_inicio')
    fecha_fin = data.get('fecha_fin')

    if not all([id_cliente, id_maquina, fecha_inicio, fecha_fin]):
        return jsonify({'error': 'Faltan datos'}), 400

    conn = get_connection()
    cursor = conn.cursor()

    # Obtener el costo mensual de la máquina
    cursor.execute("SELECT costo_mensual_alquiler FROM Maquinas WHERE id_maquina = %s", (id_maquina,))
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Máquina no encontrada'}), 404
    valor_costo = 0
    if row is not None and isinstance(row, dict) and row.get('costo_mensual_alquiler') is not None:
        valor_costo = row.get('costo_mensual_alquiler')
    elif row is not None and isinstance(row, (list, tuple)) and len(row) > 0 and row[0] is not None:
        valor_costo = row[0]
    try:
        costo_mensual = float(valor_costo)
    except Exception:
        costo_mensual = 0

    # Calcular la cantidad de meses entre fecha_inicio y fecha_fin
    cursor.execute("SELECT TIMESTAMPDIFF(MONTH, %s, %s) as meses", (fecha_inicio, fecha_fin))
    meses_row = cursor.fetchone()
    valor_meses = 1
    if meses_row is not None and isinstance(meses_row, dict) and meses_row.get('meses') is not None:
        valor_meses = meses_row.get('meses')
    elif meses_row is not None and isinstance(meses_row, (list, tuple)) and len(meses_row) > 0 and meses_row[0] is not None:
        valor_meses = meses_row[0]
    try:
        meses = int(valor_meses)
    except Exception:
        meses = 1
    if meses < 1:
        meses = 1  # Al menos un mes de alquiler
    coste_total = float(costo_mensual) * meses

    # Insertar el alquiler con el coste total calculado
    query = """
        INSERT INTO Alquileres (id_cliente, id_maquina, fecha_inicio, fecha_fin, coste_total_alquiler)
        VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(query, (id_cliente, id_maquina, fecha_inicio, fecha_fin, coste_total))
    # Actualizar el estado de la máquina a TRUE (alquilada)
    cursor.execute("UPDATE Maquinas SET estado = TRUE WHERE id_maquina = %s", (id_maquina,))
    conn.commit()
    cursor.close()
    conn.close()
<<<<<<< HEAD
    return jsonify({'mensaje': 'Solicitud de mantenimiento creada'})

# Rutas de administrador para gestión de clientes
@cliente_bp.route('/', methods=['GET'])
def listar_clientes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT c.*, u.nombre_usuario, u.email, COUNT(a.id_alquiler) as cantidad_alquileres
        FROM Clientes c
        LEFT JOIN Usuarios u ON c.rut = u.id_usuario
        LEFT JOIN Alquileres a ON c.id_cliente = a.id_cliente
        GROUP BY c.id_cliente
        ORDER BY c.nombre_empresa
    """
    cursor.execute(query)
=======
    return jsonify({'mensaje': 'Alquiler registrado', 'coste_total_alquiler': coste_total}), 201


@cliente_bp.route('/id-cliente/<int:id_usuario>', methods=['GET'])
def obtener_id_cliente(id_usuario):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id_cliente FROM Clientes WHERE rut = %s", (id_usuario,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if row:
        return jsonify(row)
    else:
        return jsonify({'error': 'Cliente no encontrado'}), 404
    
@cliente_bp.route('/alquileres-cliente/<int:id_cliente>', methods=['GET'])
def alquileres_por_cliente(id_cliente):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM Alquileres WHERE id_cliente = %s"
    cursor.execute(query, (id_cliente,))
    alquileres = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(alquileres)

@cliente_bp.route('/solicitudes', methods=['POST'])
def solicitar_mantenimiento():
    data = request.json
    id_alquiler = data.get('id_alquiler')
    descripcion = data.get('descripcion')

    if not all([id_alquiler, descripcion]):
        return jsonify({'error': 'Faltan datos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO SolicitudesMantenimiento (id_alquiler, fecha_solicitud, descripcion) VALUES (%s, CURDATE(), %s)",
        (id_alquiler, descripcion)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Solicitud enviada'}), 201

@cliente_bp.route('/ganancias-maquina/<int:id_cliente>', methods=['GET'])
def ganancias_por_maquina(id_cliente):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT m.modelo, m.marca, a.id_alquiler, gm.mes, gm.anio,
           gm.ganancia_cliente, gm.ganancia_empresa, gm.total_ventas
    FROM GananciasMaquina gm
    JOIN Alquileres a ON gm.id_alquiler = a.id_alquiler
    JOIN Maquinas m ON a.id_maquina = m.id_maquina
    WHERE a.id_cliente = %s
    ORDER BY gm.anio DESC, gm.mes DESC
    """
    cursor.execute(query, (id_cliente,))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@cliente_bp.route('/ganancias-totales/<int:id_cliente>', methods=['GET'])
def total_ganancias_cliente(id_cliente):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT SUM(gm.ganancia_cliente) AS total_ganancia
        FROM GananciasMaquina gm
        JOIN Alquileres a ON gm.id_alquiler = a.id_alquiler
        WHERE a.id_cliente = %s
    """
    cursor.execute(query, (id_cliente,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()

    return jsonify({'total_ganancia': result['total_ganancia'] or 0})

@cliente_bp.route('/', methods=['GET'])
def obtener_clientes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.*, u.nombre_usuario AS nombre
        FROM Clientes c
        LEFT JOIN Usuarios u ON c.rut = u.id_usuario
    """)
    clientes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(clientes)

# Crear nuevo cliente
@cliente_bp.route('/', methods=['POST'])
def crear_cliente():
    data = request.get_json()
    rut = data.get('rut')
    nombre_empresa = data.get('nombre_empresa')
    direccion = data.get('direccion')
    telefono = data.get('telefono')

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Clientes (rut, nombre_empresa, direccion, telefono) VALUES (%s, %s, %s, %s)",
            (rut, nombre_empresa, direccion, telefono)
        )
        conn.commit()
        return jsonify({'mensaje': 'Cliente creado correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Actualizar cliente existente
@cliente_bp.route('/<int:id_cliente>', methods=['PUT'])
def actualizar_cliente(id_cliente):
    data = request.get_json()
    nombre_empresa = data.get('nombre_empresa')
    direccion = data.get('direccion')
    telefono = data.get('telefono')

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Clientes
            SET nombre_empresa = %s, direccion = %s, telefono = %s
            WHERE id_cliente = %s
        """, (nombre_empresa, direccion, telefono, id_cliente))
        conn.commit()
        return jsonify({'mensaje': 'Cliente actualizado correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Eliminar cliente
@cliente_bp.route('/<int:id_cliente>', methods=['DELETE'])
def eliminar_cliente(id_cliente):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Clientes WHERE id_cliente = %s", (id_cliente,))
        if cursor.rowcount == 0:
            return jsonify({'error': 'Cliente no encontrado'}), 404
        conn.commit()
        return jsonify({'mensaje': 'Cliente eliminado correctamente'})
    except Exception as e:
        conn.rollback()
        error_msg = str(e)
        if 'foreign key constraint' in error_msg.lower():
            return jsonify({'error': 'No se puede eliminar un cliente que tiene alquileres'}), 400
        return jsonify({'error': error_msg}), 400
    finally:
        cursor.close()
        conn.close()

@cliente_bp.route('/alquiler-detalle/<int:id_alquiler>', methods=['GET'])
def detalle_alquiler(id_alquiler):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Info de la máquina
    cursor.execute("""
        SELECT 
            a.fecha_inicio,
            a.fecha_fin,
            a.coste_total_alquiler,
            m.modelo,
            m.marca
        FROM Alquileres a
        JOIN Maquinas m ON a.id_maquina = m.id_maquina
        WHERE a.id_alquiler = %s
    """, (id_alquiler,))
    info = cursor.fetchone()

    # Insumos consumidos
    cursor.execute("""
        SELECT 
            ci.id_consumo,
            i.nombre_insumo,
            ci.cantidad_consumida,
            ci.fecha_consumo,
            i.unidad_medida
        FROM ConsumoInsumos ci
        JOIN Insumos i ON ci.id_insumo = i.id_insumo
        WHERE ci.id_alquiler = %s
        ORDER BY ci.fecha_consumo DESC
    """, (id_alquiler,))
    insumos = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify({
        "info": info,
        "insumos": insumos
    })

@cliente_bp.route('/roles', methods=['GET'])
def listar_roles():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Roles")
    roles = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(roles)

@cliente_bp.route('/total-mensual-cobrar', methods=['GET'])
def total_mensual_cobrar():
    mes = request.args.get('mes')
    anio = request.args.get('anio')
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    params = []
    filtro_subquery = ''
    if mes and anio:
        filtro_subquery = 'WHERE MONTH(ci.fecha_consumo) = %s AND YEAR(ci.fecha_consumo) = %s'
        params.extend([int(mes), int(anio)])
    # Sumar alquileres y costos de insumos por cliente
    cursor.execute(f'''
        SELECT 
            cl.id_cliente,
            cl.nombre_empresa,
            COALESCE(SUM(a.coste_total_alquiler), 0) as total_alquileres,
            COALESCE(SUM(ci.costo_insumos), 0) as total_insumos,
            COALESCE(SUM(a.coste_total_alquiler), 0) + COALESCE(SUM(ci.costo_insumos), 0) as total_cobrar
        FROM Clientes cl
        LEFT JOIN Alquileres a ON cl.id_cliente = a.id_cliente
        LEFT JOIN (
            SELECT a.id_cliente, SUM(ci.cantidad_consumida * i.costo_unitario) as costo_insumos
            FROM ConsumoInsumos ci
            JOIN Alquileres a ON ci.id_alquiler = a.id_alquiler
            JOIN Insumos i ON ci.id_insumo = i.id_insumo
            {filtro_subquery}
            GROUP BY a.id_cliente
        ) ci ON cl.id_cliente = ci.id_cliente
        GROUP BY cl.id_cliente, cl.nombre_empresa
        ORDER BY total_cobrar DESC
    ''', params)
>>>>>>> 64dfde0d9fee8ff8bf5f84b23071d91a6e57b09f
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

<<<<<<< HEAD
@cliente_bp.route('/', methods=['POST'])
def crear_cliente():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    # Hash de la contraseña usando bcrypt
    password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    # Primero crear el usuario
    query_usuario = """
        INSERT INTO Usuarios (nombre_usuario, email, password_hash, id_rol)
        VALUES (%s, %s, %s, 2)
    """
    cursor.execute(query_usuario, (
        data['nombre_empresa'],
        data['email'],
        password_hash
    ))
    id_usuario = cursor.lastrowid
    
    # Luego crear el cliente
    query_cliente = """
        INSERT INTO Clientes (rut, nombre_empresa, direccion, telefono)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query_cliente, (
        id_usuario,
        data['nombre_empresa'],
        data.get('direccion'),
        data.get('telefono')
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Cliente creado correctamente'}), 201

@cliente_bp.route('/<int:id_cliente>', methods=['PUT'])
def actualizar_cliente(id_cliente):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        UPDATE Clientes 
        SET nombre_empresa = %s, direccion = %s, telefono = %s
        WHERE id_cliente = %s
    """
    cursor.execute(query, (
        data['nombre_empresa'],
        data.get('direccion'),
        data.get('telefono'),
        id_cliente
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Cliente actualizado correctamente'})

@cliente_bp.route('/<int:id_cliente>', methods=['DELETE'])
def eliminar_cliente(id_cliente):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Verificar si el cliente tiene alquileres
    cursor.execute("SELECT COUNT(*) as count FROM Alquileres WHERE id_cliente = %s", (id_cliente,))
    result = cursor.fetchone()
    if result[0] > 0:
        cursor.close()
        conn.close()
        return jsonify({'error': 'No se puede eliminar un cliente que tiene alquileres'}), 400
    
    # Obtener el rut del cliente para eliminar también el usuario
    cursor.execute("SELECT rut FROM Clientes WHERE id_cliente = %s", (id_cliente,))
    rut = cursor.fetchone()[0]
    
    # Eliminar cliente y usuario
    cursor.execute("DELETE FROM Clientes WHERE id_cliente = %s", (id_cliente,))
    cursor.execute("DELETE FROM Usuarios WHERE id_usuario = %s", (rut,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Cliente eliminado correctamente'})
=======
@cliente_bp.route('/top-clientes-alquileres', methods=['GET'])
def top_clientes_alquileres():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('''
        SELECT cl.id_cliente, cl.nombre_empresa, COUNT(a.id_alquiler) as cantidad_alquileres
        FROM Clientes cl
        LEFT JOIN Alquileres a ON cl.id_cliente = a.id_cliente
        GROUP BY cl.id_cliente, cl.nombre_empresa
        ORDER BY cantidad_alquileres DESC
    ''')
    ranking = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(ranking)
>>>>>>> 64dfde0d9fee8ff8bf5f84b23071d91a6e57b09f
