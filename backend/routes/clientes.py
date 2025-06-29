from flask import Blueprint, request, jsonify
from db import get_connection
import bcrypt

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
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

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
