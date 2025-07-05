from flask import Blueprint, request, jsonify
from db import get_connection

proveedor_bp = Blueprint('proveedor', __name__, url_prefix='/proveedor')

# Obtener todos los proveedores
@proveedor_bp.route('/', methods=['GET'])
def obtener_proveedores():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Proveedores")
    proveedores = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(proveedores)

# Crear nuevo proveedor
@proveedor_bp.route('/', methods=['POST'])
def crear_proveedor():
    data = request.get_json()
    nombre_proveedor = data.get('nombre_proveedor')
    telefono = data.get('telefono')
    email = data.get('email')
    direccion = data.get('direccion')

    if not all([nombre_proveedor, telefono, email, direccion]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Proveedores (nombre_proveedor, telefono, email, direccion) VALUES (%s, %s, %s, %s)",
            (nombre_proveedor, telefono, email, direccion)
        )
        conn.commit()
        return jsonify({'mensaje': 'Proveedor creado correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Actualizar proveedor existente
@proveedor_bp.route('/<int:id_proveedor>', methods=['PUT'])
def actualizar_proveedor(id_proveedor):
    data = request.get_json()
    nombre_proveedor = data.get('nombre_proveedor')
    telefono = data.get('telefono')
    email = data.get('email')
    direccion = data.get('direccion')

    if not all([nombre_proveedor, telefono, email, direccion]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Proveedores 
            SET nombre_proveedor = %s, telefono = %s, email = %s, direccion = %s 
            WHERE id_proveedor = %s
        """, (nombre_proveedor, telefono, email, direccion, id_proveedor))
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Proveedor no encontrado'}), 404
            
        conn.commit()
        return jsonify({'mensaje': 'Proveedor actualizado correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Eliminar proveedor
@proveedor_bp.route('/<int:id_proveedor>', methods=['DELETE'])
def eliminar_proveedor(id_proveedor):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Proveedores WHERE id_proveedor = %s", (id_proveedor,))
        if cursor.rowcount == 0:
            return jsonify({'error': 'Proveedor no encontrado'}), 404
        conn.commit()
        return jsonify({'mensaje': 'Proveedor eliminado correctamente'})
    except Exception as e:
        conn.rollback()
        error_msg = str(e)
        if 'foreign key constraint' in error_msg.lower():
            return jsonify({'error': 'No se puede eliminar un proveedor que tiene insumos asociados'}), 400
        return jsonify({'error': error_msg}), 400
    finally:
        cursor.close()
        conn.close()

# Obtener proveedor por ID
@proveedor_bp.route('/<int:id_proveedor>', methods=['GET'])
def obtener_proveedor(id_proveedor):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Proveedores WHERE id_proveedor = %s", (id_proveedor,))
    proveedor = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if proveedor:
        return jsonify(proveedor)
    else:
        return jsonify({'error': 'Proveedor no encontrado'}), 404 

