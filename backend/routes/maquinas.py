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
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Máquina creada correctamente'}), 201

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
    cursor.execute("DELETE FROM Maquinas WHERE id_maquina = %s", (id_maquina,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Máquina eliminada correctamente'}), 200