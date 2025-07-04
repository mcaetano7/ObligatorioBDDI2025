from flask import Blueprint, request, jsonify
from db import get_connection

mantenimiento_bp = Blueprint('mantenimiento', __name__, url_prefix='/mantenimiento')

# Obtener todas las solicitudes de mantenimiento
@mantenimiento_bp.route('/', methods=['GET'])
def obtener_solicitudes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT sm.*, c.nombre_empresa, t.nombre_tecnico, m.modelo, m.marca 
        FROM SolicitudesMantenimiento sm 
        JOIN Alquileres a ON sm.id_alquiler = a.id_alquiler 
        JOIN Clientes c ON a.id_cliente = c.id_cliente 
        JOIN Maquinas m ON a.id_maquina = m.id_maquina 
        LEFT JOIN Tecnicos t ON sm.id_tecnico_asignado = t.id_tecnico
    """)
    solicitudes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(solicitudes)

# Crear nueva solicitud de mantenimiento
@mantenimiento_bp.route('/', methods=['POST'])
def crear_solicitud():
    data = request.get_json()
    id_alquiler = data.get('id_alquiler')
    descripcion = data.get('descripcion')
    id_tecnico_asignado = data.get('id_tecnico_asignado')

    if not all([id_alquiler, descripcion]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        if id_tecnico_asignado:
            cursor.execute("""
                INSERT INTO SolicitudesMantenimiento (id_alquiler, fecha_solicitud, descripcion, id_tecnico_asignado, fecha_asignacion) 
                VALUES (%s, CURDATE(), %s, %s, CURDATE())
            """, (id_alquiler, descripcion, id_tecnico_asignado))
        else:
            cursor.execute("""
                INSERT INTO SolicitudesMantenimiento (id_alquiler, fecha_solicitud, descripcion) 
                VALUES (%s, CURDATE(), %s)
            """, (id_alquiler, descripcion))
        
        conn.commit()
        return jsonify({'mensaje': 'Solicitud de mantenimiento creada correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Actualizar solicitud de mantenimiento
@mantenimiento_bp.route('/<int:id_solicitud>', methods=['PUT'])
def actualizar_solicitud(id_solicitud):
    data = request.get_json()
    descripcion = data.get('descripcion')
    id_tecnico_asignado = data.get('id_tecnico_asignado')

    if not descripcion:
        return jsonify({'error': 'Falta descripción'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        if id_tecnico_asignado:
            cursor.execute("""
                UPDATE SolicitudesMantenimiento 
                SET descripcion = %s, id_tecnico_asignado = %s, fecha_asignacion = CURDATE() 
                WHERE id_solicitud = %s
            """, (descripcion, id_tecnico_asignado, id_solicitud))
        else:
            cursor.execute("""
                UPDATE SolicitudesMantenimiento 
                SET descripcion = %s 
                WHERE id_solicitud = %s
            """, (descripcion, id_solicitud))
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Solicitud no encontrada'}), 404
            
        conn.commit()
        return jsonify({'mensaje': 'Solicitud actualizada correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Marcar solicitud como completada
@mantenimiento_bp.route('/<int:id_solicitud>/completar', methods=['PUT'])
def completar_solicitud(id_solicitud):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE SolicitudesMantenimiento 
            SET fecha_resolucion = CURDATE() 
            WHERE id_solicitud = %s
        """, (id_solicitud,))
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Solicitud no encontrada'}), 404
            
        conn.commit()
        return jsonify({'mensaje': 'Solicitud marcada como completada'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Eliminar solicitud de mantenimiento
@mantenimiento_bp.route('/<int:id_solicitud>', methods=['DELETE'])
def eliminar_solicitud(id_solicitud):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM SolicitudesMantenimiento WHERE id_solicitud = %s", (id_solicitud,))
        if cursor.rowcount == 0:
            return jsonify({'error': 'Solicitud no encontrada'}), 404
        conn.commit()
        return jsonify({'mensaje': 'Solicitud eliminada correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Obtener solicitud por ID
@mantenimiento_bp.route('/<int:id_solicitud>', methods=['GET'])
def obtener_solicitud(id_solicitud):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT sm.*, c.nombre_empresa, t.nombre_tecnico, m.modelo, m.marca 
        FROM SolicitudesMantenimiento sm 
        JOIN Alquileres a ON sm.id_alquiler = a.id_alquiler 
        JOIN Clientes c ON a.id_cliente = c.id_cliente 
        JOIN Maquinas m ON a.id_maquina = m.id_maquina 
        LEFT JOIN Tecnicos t ON sm.id_tecnico_asignado = t.id_tecnico 
        WHERE sm.id_solicitud = %s
    """, (id_solicitud,))
    solicitud = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if solicitud:
        return jsonify(solicitud)
    else:
        return jsonify({'error': 'Solicitud no encontrada'}), 404

# Obtener solicitudes pendientes (no completadas)
@mantenimiento_bp.route('/pendientes', methods=['GET'])
def obtener_solicitudes_pendientes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT sm.*, c.nombre_empresa, t.nombre_tecnico, m.modelo, m.marca 
        FROM SolicitudesMantenimiento sm 
        JOIN Alquileres a ON sm.id_alquiler = a.id_alquiler 
        JOIN Clientes c ON a.id_cliente = c.id_cliente 
        JOIN Maquinas m ON a.id_maquina = m.id_maquina 
        LEFT JOIN Tecnicos t ON sm.id_tecnico_asignado = t.id_tecnico 
        WHERE sm.fecha_resolucion IS NULL
    """)
    solicitudes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(solicitudes)

# Obtener solicitudes por técnico
@mantenimiento_bp.route('/tecnico/<int:id_tecnico>', methods=['GET'])
def obtener_solicitudes_por_tecnico(id_tecnico):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT sm.*, c.nombre_empresa, t.nombre_tecnico, m.modelo, m.marca 
        FROM SolicitudesMantenimiento sm 
        JOIN Alquileres a ON sm.id_alquiler = a.id_alquiler 
        JOIN Clientes c ON a.id_cliente = c.id_cliente 
        JOIN Maquinas m ON a.id_maquina = m.id_maquina 
        JOIN Tecnicos t ON sm.id_tecnico_asignado = t.id_tecnico 
        WHERE sm.id_tecnico_asignado = %s
    """, (id_tecnico,))
    solicitudes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(solicitudes)

# Obtener el ranking de técnicos con más mantenimientos realizados
@mantenimiento_bp.route('/top-tecnicos', methods=['GET'])
def top_tecnicos():
    mes = request.args.get('mes')
    anio = request.args.get('anio')
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    filtro_fecha = ''
    params = []
    if mes and anio:
        filtro_fecha = 'AND MONTH(sm.fecha_resolucion) = %s AND YEAR(sm.fecha_resolucion) = %s'
        params.extend([int(mes), int(anio)])
    cursor.execute(f'''
        SELECT 
            t.id_tecnico,
            t.nombre_tecnico,
            COUNT(sm.id_solicitud) as mantenimientos_realizados
        FROM SolicitudesMantenimiento sm
        JOIN Tecnicos t ON sm.id_tecnico_asignado = t.id_tecnico
        WHERE sm.fecha_resolucion IS NOT NULL {filtro_fecha}
        GROUP BY t.id_tecnico, t.nombre_tecnico
        ORDER BY mantenimientos_realizados DESC
    ''', params)
    ranking = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(ranking) 