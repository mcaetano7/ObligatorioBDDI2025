from flask import Blueprint, jsonify, request
from db import get_connection

maquinas_bp = Blueprint('maquinas', __name__, url_prefix='/maquinas')

@maquinas_bp.route('/', methods=['GET'])
def listar_maquinas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Maquinas ORDER BY id_maquina")
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

@maquinas_bp.route('/', methods=['POST'])
def crear_maquina():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        INSERT INTO Maquinas (modelo, marca, capacidad_cafe, capacidad_agua, costo_mensual_alquiler, porcentaje_ganancia_empresa)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (
        data['modelo'],
        data['marca'],
        data['capacidad_cafe'],
        data['capacidad_agua'],
        data['costo_mensual_alquiler'],
        data['porcentaje_ganancia_empresa']
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Máquina creada correctamente'}), 201

@maquinas_bp.route('/<int:id_maquina>', methods=['PUT'])
def actualizar_maquina(id_maquina):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        UPDATE Maquinas 
        SET modelo = %s, marca = %s, capacidad_cafe = %s, capacidad_agua = %s, 
            costo_mensual_alquiler = %s, porcentaje_ganancia_empresa = %s
        WHERE id_maquina = %s
    """
    cursor.execute(query, (
        data['modelo'],
        data['marca'],
        data['capacidad_cafe'],
        data['capacidad_agua'],
        data['costo_mensual_alquiler'],
        data['porcentaje_ganancia_empresa'],
        id_maquina
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Máquina actualizada correctamente'})

@maquinas_bp.route('/<int:id_maquina>', methods=['DELETE'])
def eliminar_maquina(id_maquina):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Verificar si la máquina está en alquiler
    cursor.execute("SELECT COUNT(*) as count FROM Alquileres WHERE id_maquina = %s", (id_maquina,))
    result = cursor.fetchone()
    if result[0] > 0:
        cursor.close()
        conn.close()
        return jsonify({'error': 'No se puede eliminar una máquina que está en alquiler'}), 400
    
    cursor.execute("DELETE FROM Maquinas WHERE id_maquina = %s", (id_maquina,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Máquina eliminada correctamente'})

@maquinas_bp.route('/disponibles', methods=['GET'])
def maquinas_disponibles():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT m.*
        FROM Maquinas m
        WHERE m.id_maquina NOT IN (
            SELECT DISTINCT id_maquina 
            FROM Alquileres 
            WHERE fecha_fin >= CURDATE()
        )
    """
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@maquinas_bp.route('/en-alquiler', methods=['GET'])
def maquinas_en_alquiler():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT m.*, a.fecha_inicio, a.fecha_fin, c.nombre_empresa
        FROM Maquinas m
        JOIN Alquileres a ON m.id_maquina = a.id_maquina
        JOIN Clientes c ON a.id_cliente = c.id_cliente
        WHERE a.fecha_fin >= CURDATE()
        ORDER BY a.fecha_inicio
    """
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)