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