from flask import Blueprint, request, jsonify
from db import get_connection

cafe_bp = Blueprint('cafe', __name__, url_prefix='/cafe')

# Obtener todos los cafés
@cafe_bp.route('/', methods=['GET'])
def obtener_cafes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Cafes")
    cafes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(cafes)

# Crear nuevo café
@cafe_bp.route('/', methods=['POST'])
def crear_cafe():
    data = request.get_json()
    nombre_cafe = data.get('nombre_cafe')
    precio_venta = data.get('precio_venta')
    descripcion = data.get('descripcion')

    if not all([nombre_cafe, precio_venta, descripcion]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Cafes (nombre_cafe, precio_venta, descripcion) VALUES (%s, %s, %s)",
            (nombre_cafe, precio_venta, descripcion)
        )
        conn.commit()
        return jsonify({'mensaje': 'Café creado correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Actualizar café existente
@cafe_bp.route('/<int:id_cafe>', methods=['PUT'])
def actualizar_cafe(id_cafe):
    data = request.get_json()
    nombre_cafe = data.get('nombre_cafe')
    precio_venta = data.get('precio_venta')
    descripcion = data.get('descripcion')

    if not all([nombre_cafe, precio_venta, descripcion]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Cafes 
            SET nombre_cafe = %s, precio_venta = %s, descripcion = %s 
            WHERE id_cafe = %s
        """, (nombre_cafe, precio_venta, descripcion, id_cafe))
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Café no encontrado'}), 404
            
        conn.commit()
        return jsonify({'mensaje': 'Café actualizado correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Eliminar café
@cafe_bp.route('/<int:id_cafe>', methods=['DELETE'])
def eliminar_cafe(id_cafe):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Cafes WHERE id_cafe = %s", (id_cafe,))
        if cursor.rowcount == 0:
            return jsonify({'error': 'Café no encontrado'}), 404
        conn.commit()
        return jsonify({'mensaje': 'Café eliminado correctamente'})
    except Exception as e:
        conn.rollback()
        error_msg = str(e)
        if 'foreign key constraint' in error_msg.lower():
            return jsonify({'error': 'No se puede eliminar un café que está asociado a máquinas o ventas'}), 400
        return jsonify({'error': error_msg}), 400
    finally:
        cursor.close()
        conn.close()

# Obtener café por ID
@cafe_bp.route('/<int:id_cafe>', methods=['GET'])
def obtener_cafe(id_cafe):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Cafes WHERE id_cafe = %s", (id_cafe,))
    cafe = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if cafe:
        return jsonify(cafe)
    else:
        return jsonify({'error': 'Café no encontrado'}), 404

# Obtener cafés de una máquina específica
@cafe_bp.route('/maquina/<int:id_maquina>', methods=['GET'])
def obtener_cafes_por_maquina(id_maquina):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT c.*, mc.id_maquina 
        FROM Cafes c 
        JOIN MaquinaCafes mc ON c.id_cafe = mc.id_cafe 
        WHERE mc.id_maquina = %s
    """, (id_maquina,))
    cafes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(cafes)

# Agregar café a una máquina
@cafe_bp.route('/maquina/<int:id_maquina>/cafe/<int:id_cafe>', methods=['POST'])
def agregar_cafe_a_maquina(id_maquina, id_cafe):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO MaquinaCafes (id_maquina, id_cafe) VALUES (%s, %s)",
            (id_maquina, id_cafe)
        )
        conn.commit()
        return jsonify({'mensaje': 'Café agregado a la máquina correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Eliminar café de una máquina
@cafe_bp.route('/maquina/<int:id_maquina>/cafe/<int:id_cafe>', methods=['DELETE'])
def eliminar_cafe_de_maquina(id_maquina, id_cafe):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "DELETE FROM MaquinaCafes WHERE id_maquina = %s AND id_cafe = %s",
            (id_maquina, id_cafe)
        )
        if cursor.rowcount == 0:
            return jsonify({'error': 'Asociación no encontrada'}), 404
        conn.commit()
        return jsonify({'mensaje': 'Café eliminado de la máquina correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close() 