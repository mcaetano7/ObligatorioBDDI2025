from flask import Blueprint, request, jsonify
from db import get_connection

cliente_bp = Blueprint('cliente', __name__, url_prefix='/cliente')


@cliente_bp.route('/maquinas/disponibles', methods=['GET'])
def maquinas_disponibles():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM Maquinas
        WHERE id_maquina NOT IN (
            SELECT id_maquina FROM Alquileres
            WHERE CURDATE() BETWEEN fecha_inicio AND fecha_fin
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

    query = """
        INSERT INTO Alquileres (id_cliente, id_maquina, fecha_inicio, fecha_fin)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query, (id_cliente, id_maquina, fecha_inicio, fecha_fin))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Alquiler registrado'}), 201


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