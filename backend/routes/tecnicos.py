<<<<<<< HEAD
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
=======
from flask import Blueprint, request, jsonify
from db import get_connection

tecnico_bp = Blueprint('tecnico', __name__, url_prefix='/tecnico')

# Obtener todos los técnicos
@tecnico_bp.route('/', methods=['GET'])
def obtener_tecnicos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Tecnicos")
    tecnicos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tecnicos)

# Crear nuevo técnico
@tecnico_bp.route('/', methods=['POST'])
def crear_tecnico():
    data = request.get_json()
    nombre_tecnico = data.get('nombre_tecnico')
    telefono = data.get('telefono')
    email = data.get('email')

    if not all([nombre_tecnico, telefono, email]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Tecnicos (nombre_tecnico, telefono, email) VALUES (%s, %s, %s)",
            (nombre_tecnico, telefono, email)
        )
        conn.commit()
        return jsonify({'mensaje': 'Técnico creado correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Actualizar técnico existente
@tecnico_bp.route('/<int:id_tecnico>', methods=['PUT'])
def actualizar_tecnico(id_tecnico):
    data = request.get_json()
    nombre_tecnico = data.get('nombre_tecnico')
    telefono = data.get('telefono')
    email = data.get('email')

    if not all([nombre_tecnico, telefono, email]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Tecnicos 
            SET nombre_tecnico = %s, telefono = %s, email = %s 
            WHERE id_tecnico = %s
        """, (nombre_tecnico, telefono, email, id_tecnico))
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Técnico no encontrado'}), 404
            
        conn.commit()
        return jsonify({'mensaje': 'Técnico actualizado correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Eliminar técnico
@tecnico_bp.route('/<int:id_tecnico>', methods=['DELETE'])
def eliminar_tecnico(id_tecnico):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Tecnicos WHERE id_tecnico = %s", (id_tecnico,))
        if cursor.rowcount == 0:
            return jsonify({'error': 'Técnico no encontrado'}), 404
        conn.commit()
        return jsonify({'mensaje': 'Técnico eliminado correctamente'})
    except Exception as e:
        conn.rollback()
        error_msg = str(e)
        if 'foreign key constraint' in error_msg.lower():
            return jsonify({'error': 'No se puede eliminar un técnico que tiene solicitudes de mantenimiento asignadas'}), 400
        return jsonify({'error': error_msg}), 400
    finally:
        cursor.close()
        conn.close()

# Obtener técnico por ID
@tecnico_bp.route('/<int:id_tecnico>', methods=['GET'])
def obtener_tecnico(id_tecnico):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Tecnicos WHERE id_tecnico = %s", (id_tecnico,))
    tecnico = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if tecnico:
        return jsonify(tecnico)
    else:
        return jsonify({'error': 'Técnico no encontrado'}), 404

# Obtener técnicos disponibles (no asignados a mantenimientos)
@tecnico_bp.route('/disponibles', methods=['GET'])
def obtener_tecnicos_disponibles():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT t.* 
        FROM Tecnicos t 
        WHERE t.id_tecnico NOT IN (
            SELECT DISTINCT id_tecnico_asignado 
            FROM SolicitudesMantenimiento 
            WHERE id_tecnico_asignado IS NOT NULL
        )
    """)
    tecnicos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tecnicos) 
>>>>>>> 64dfde0d9fee8ff8bf5f84b23071d91a6e57b09f
