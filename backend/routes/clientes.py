from flask import Blueprint, request, jsonify
from db import get_connection

cliente_bp = Blueprint('cliente', __name__, url_prefix='/cliente')

@cliente_bp.route('/alquileres/<int:id_usuario>', methods=['GET'])
def alquileres_usuario(id_usuario):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT a.*
        FROM Alquileres a
        JOIN Clientes c ON a.id_cliente = c.id_cliente
        WHERE c.rut = %s
    """
    cursor.execute(query, (id_usuario,))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@cliente_bp.route('/maquinas/disponibles', methods=['GET'])
def maquinas_disponibles():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT *
        FROM Maquinas
        WHERE id_maquina NOT IN (SELECT id_maquina FROM Alquileres)
    """
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@cliente_bp.route('/gasto/<int:id_alquiler>', methods=['GET'])
def gasto_individual(id_alquiler):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT coste_total_alquiler FROM Alquileres WHERE id_alquiler = %s"
    cursor.execute(query, (id_alquiler,))
    data = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(data)

@cliente_bp.route('/gasto-total/<int:id_usuario>', methods=['GET'])
def gasto_total_usuario(id_usuario):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT SUM(a.coste_total_alquiler) AS gasto_total
        FROM Alquileres a
        JOIN Clientes c ON a.id_cliente = c.id_cliente
        WHERE c.rut = %s
    """
    cursor.execute(query, (id_usuario,))
    data = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(data)

@cliente_bp.route('/ganancia/<int:id_alquiler>', methods=['GET'])
def ganancia_individual(id_alquiler):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM GananciasMaquina WHERE id_alquiler = %s"
    cursor.execute(query, (id_alquiler,))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@cliente_bp.route('/ganancia-total/<int:id_usuario>', methods=['GET'])
def ganancia_total_usuario(id_usuario):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT SUM(gm.ganancia_cliente) AS total_ganancia_cliente,
               SUM(gm.ganancia_empresa) AS total_ganancia_empresa,
               SUM(gm.total_ventas) AS total_ventas
        FROM GananciasMaquina gm
        JOIN Alquileres a ON gm.id_alquiler = a.id_alquiler
        JOIN Clientes c ON a.id_cliente = c.id_cliente
        WHERE c.rut = %s
    """
    cursor.execute(query, (id_usuario,))
    data = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(data)

@cliente_bp.route('/alquileres', methods=['POST'])
def crear_alquiler():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    query = """
        INSERT INTO Alquileres (id_maquina, id_cliente, fecha_inicio, fecha_fin, ganancias_maquina_total, coste_total_alquiler)
        VALUES (%s, %s, %s, %s, 0, 0)
    """
    cursor.execute(query, (datos['id_maquina'], datos['id_cliente'], datos['fecha_inicio'], datos['fecha_fin']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Alquiler creado correctamente'})

@cliente_bp.route('/solicitudes-mantenimiento', methods=['POST'])
def crear_solicitud():
    datos = request.json
    conn = get_connection()
    cursor = conn.cursor()
    query = """
        INSERT INTO SolicitudesMantenimiento (id_alquiler, fecha_solicitud, descripcion)
        VALUES (%s, CURDATE(), %s)
    """
    cursor.execute(query, (datos['id_alquiler'], datos['descripcion']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Solicitud de mantenimiento creada'})
