from flask import Blueprint, jsonify, request
from db import get_connection

tecnicos_bp = Blueprint('tecnicos', __name__, url_prefix='/tecnicos')

@tecnicos_bp.route('/', methods=['GET'])
def listar_tecnicos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT t.*, COUNT(sm.id_solicitud) as cantidad_mantenimientos
        FROM Tecnicos t
        LEFT JOIN SolicitudesMantenimiento sm ON t.id_tecnico = sm.id_tecnico_asignado
        GROUP BY t.id_tecnico
        ORDER BY t.nombre_tecnico
    """
    cursor.execute(query)
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

@tecnicos_bp.route('', methods=['POST'])
@tecnicos_bp.route('/', methods=['POST'])
def crear_tecnico():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        INSERT INTO Tecnicos (nombre_tecnico, telefono, email)
        VALUES (%s, %s, %s)
    """
    cursor.execute(query, (
        data['nombre_tecnico'],
        data.get('telefono'),
        data.get('email')
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Técnico creado correctamente'}), 201

@tecnicos_bp.route('/<int:id_tecnico>', methods=['PUT'])
def actualizar_tecnico(id_tecnico):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        UPDATE Tecnicos 
        SET nombre_tecnico = %s, telefono = %s, email = %s
        WHERE id_tecnico = %s
    """
    cursor.execute(query, (
        data['nombre_tecnico'],
        data.get('telefono'),
        data.get('email'),
        id_tecnico
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Técnico actualizado correctamente'})

@tecnicos_bp.route('/<int:id_tecnico>', methods=['DELETE'])
def eliminar_tecnico(id_tecnico):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Verificar si el técnico tiene mantenimientos asignados
    cursor.execute("SELECT COUNT(*) as count FROM SolicitudesMantenimiento WHERE id_tecnico_asignado = %s", (id_tecnico,))
    result = cursor.fetchone()
    if result[0] > 0:
        cursor.close()
        conn.close()
        return jsonify({'error': 'No se puede eliminar un técnico que tiene mantenimientos asignados'}), 400
    
    cursor.execute("DELETE FROM Tecnicos WHERE id_tecnico = %s", (id_tecnico,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Técnico eliminado correctamente'})

@tecnicos_bp.route('/<int:id_tecnico>/mantenimientos', methods=['GET'])
def mantenimientos_tecnico(id_tecnico):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT sm.*, c.nombre_empresa, m.modelo, m.marca
        FROM SolicitudesMantenimiento sm
        JOIN Alquileres a ON sm.id_alquiler = a.id_alquiler
        JOIN Clientes c ON a.id_cliente = c.id_cliente
        JOIN Maquinas m ON a.id_maquina = m.id_maquina
        WHERE sm.id_tecnico_asignado = %s
        ORDER BY sm.fecha_solicitud DESC
    """
    cursor.execute(query, (id_tecnico,))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@tecnicos_bp.route('/top-mantenimientos', methods=['GET'])
def top_tecnicos_mantenimientos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            t.nombre_tecnico,
            COUNT(sm.id_solicitud) as cantidad_mantenimientos,
            COUNT(CASE WHEN sm.fecha_resolucion IS NOT NULL THEN 1 END) as mantenimientos_completados,
            COUNT(CASE WHEN sm.fecha_resolucion IS NULL THEN 1 END) as mantenimientos_pendientes
        FROM Tecnicos t
        LEFT JOIN SolicitudesMantenimiento sm ON t.id_tecnico = sm.id_tecnico_asignado
        GROUP BY t.id_tecnico, t.nombre_tecnico
        ORDER BY cantidad_mantenimientos DESC
    """
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data) 