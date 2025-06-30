from flask import Blueprint, jsonify, request
from db import get_connection

mantenimientos_bp = Blueprint('mantenimientos', __name__, url_prefix='/mantenimientos')

@mantenimientos_bp.route('/', methods=['GET'])
def listar_mantenimientos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            sm.*,
            c.nombre_empresa,
            m.modelo,
            m.marca,
            t.nombre_tecnico
        FROM SolicitudesMantenimiento sm
        JOIN Alquileres a ON sm.id_alquiler = a.id_alquiler
        JOIN Clientes c ON a.id_cliente = c.id_cliente
        JOIN Maquinas m ON a.id_maquina = m.id_maquina
        LEFT JOIN Tecnicos t ON sm.id_tecnico_asignado = t.id_tecnico
        ORDER BY sm.fecha_solicitud DESC
    """
    cursor.execute(query)
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

@mantenimientos_bp.route('/', methods=['POST'])
def crear_mantenimiento():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        INSERT INTO SolicitudesMantenimiento (id_alquiler, fecha_solicitud, descripcion)
        VALUES (%s, CURDATE(), %s)
    """
    cursor.execute(query, (
        data['id_alquiler'],
        data['descripcion']
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Solicitud de mantenimiento creada correctamente'}), 201

@mantenimientos_bp.route('/<int:id_solicitud>', methods=['PUT'])
def actualizar_mantenimiento(id_solicitud):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        UPDATE SolicitudesMantenimiento 
        SET descripcion = %s, id_tecnico_asignado = %s, fecha_asignacion = %s, fecha_resolucion = %s
        WHERE id_solicitud = %s
    """
    cursor.execute(query, (
        data.get('descripcion'),
        data.get('id_tecnico_asignado'),
        data.get('fecha_asignacion'),
        data.get('fecha_resolucion'),
        id_solicitud
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Mantenimiento actualizado correctamente'})

@mantenimientos_bp.route('/<int:id_solicitud>', methods=['DELETE'])
def eliminar_mantenimiento(id_solicitud):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM SolicitudesMantenimiento WHERE id_solicitud = %s", (id_solicitud,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Mantenimiento eliminado correctamente'})

@mantenimientos_bp.route('/asignar-tecnico', methods=['POST'])
def asignar_tecnico():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        UPDATE SolicitudesMantenimiento 
        SET id_tecnico_asignado = %s, fecha_asignacion = CURDATE()
        WHERE id_solicitud = %s
    """
    cursor.execute(query, (
        data['id_tecnico'],
        data['id_solicitud']
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Técnico asignado correctamente'})

@mantenimientos_bp.route('/completar/<int:id_solicitud>', methods=['POST'])
def completar_mantenimiento(id_solicitud):
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        UPDATE SolicitudesMantenimiento 
        SET fecha_resolucion = CURDATE()
        WHERE id_solicitud = %s
    """
    cursor.execute(query, (id_solicitud,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Mantenimiento completado correctamente'})

@mantenimientos_bp.route('/pendientes', methods=['GET'])
def mantenimientos_pendientes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            sm.*,
            c.nombre_empresa,
            m.modelo,
            m.marca
        FROM SolicitudesMantenimiento sm
        JOIN Alquileres a ON sm.id_alquiler = a.id_alquiler
        JOIN Clientes c ON a.id_cliente = c.id_cliente
        JOIN Maquinas m ON a.id_maquina = m.id_maquina
        WHERE sm.fecha_resolucion IS NULL
        ORDER BY sm.fecha_solicitud ASC
    """
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@mantenimientos_bp.route('/completados', methods=['GET'])
def mantenimientos_completados():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            sm.*,
            c.nombre_empresa,
            m.modelo,
            m.marca,
            t.nombre_tecnico
        FROM SolicitudesMantenimiento sm
        JOIN Alquileres a ON sm.id_alquiler = a.id_alquiler
        JOIN Clientes c ON a.id_cliente = c.id_cliente
        JOIN Maquinas m ON a.id_maquina = m.id_maquina
        LEFT JOIN Tecnicos t ON sm.id_tecnico_asignado = t.id_tecnico
        WHERE sm.fecha_resolucion IS NOT NULL
        ORDER BY sm.fecha_resolucion DESC
    """
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data) 