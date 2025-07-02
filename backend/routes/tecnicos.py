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