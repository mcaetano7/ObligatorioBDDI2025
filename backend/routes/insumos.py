from flask import Blueprint, request, jsonify
from db import get_connection

insumo_bp = Blueprint('insumo', __name__, url_prefix='/insumo')

# Obtener todos los insumos con información del proveedor
@insumo_bp.route('/', methods=['GET'])
def obtener_insumos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT i.*, p.nombre_proveedor 
        FROM Insumos i 
        JOIN Proveedores p ON i.id_proveedor = p.id_proveedor
    """)
    insumos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(insumos)

# Crear nuevo insumo
@insumo_bp.route('/', methods=['POST'])
def crear_insumo():
    data = request.get_json()
    nombre_insumo = data.get('nombre_insumo')
    unidad_medida = data.get('unidad_medida')
    costo_unitario = data.get('costo_unitario')
    id_proveedor = data.get('id_proveedor')

    if not all([nombre_insumo, unidad_medida, costo_unitario, id_proveedor]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO Insumos (nombre_insumo, unidad_medida, costo_unitario, id_proveedor) VALUES (%s, %s, %s, %s)",
            (nombre_insumo, unidad_medida, costo_unitario, id_proveedor)
        )
        conn.commit()
        return jsonify({'mensaje': 'Insumo creado correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Actualizar insumo existente
@insumo_bp.route('/<int:id_insumo>', methods=['PUT'])
def actualizar_insumo(id_insumo):
    data = request.get_json()
    nombre_insumo = data.get('nombre_insumo')
    unidad_medida = data.get('unidad_medida')
    costo_unitario = data.get('costo_unitario')
    id_proveedor = data.get('id_proveedor')

    if not all([nombre_insumo, unidad_medida, costo_unitario, id_proveedor]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Insumos 
            SET nombre_insumo = %s, unidad_medida = %s, costo_unitario = %s, id_proveedor = %s 
            WHERE id_insumo = %s
        """, (nombre_insumo, unidad_medida, costo_unitario, id_proveedor, id_insumo))
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Insumo no encontrado'}), 404
            
        conn.commit()
        return jsonify({'mensaje': 'Insumo actualizado correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Eliminar insumo
@insumo_bp.route('/<int:id_insumo>', methods=['DELETE'])
def eliminar_insumo(id_insumo):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Insumos WHERE id_insumo = %s", (id_insumo,))
        if cursor.rowcount == 0:
            return jsonify({'error': 'Insumo no encontrado'}), 404
        conn.commit()
        return jsonify({'mensaje': 'Insumo eliminado correctamente'})
    except Exception as e:
        conn.rollback()
        error_msg = str(e)
        if 'foreign key constraint' in error_msg.lower():
            return jsonify({'error': 'No se puede eliminar un insumo que tiene consumos asociados'}), 400
        return jsonify({'error': error_msg}), 400
    finally:
        cursor.close()
        conn.close()

# Obtener insumo por ID
@insumo_bp.route('/<int:id_insumo>', methods=['GET'])
def obtener_insumo(id_insumo):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT i.*, p.nombre_proveedor 
        FROM Insumos i 
        JOIN Proveedores p ON i.id_proveedor = p.id_proveedor 
        WHERE i.id_insumo = %s
    """, (id_insumo,))
    insumo = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if insumo:
        return jsonify(insumo)
    else:
        return jsonify({'error': 'Insumo no encontrado'}), 404

# Obtener insumos por proveedor
@insumo_bp.route('/proveedor/<int:id_proveedor>', methods=['GET'])
def obtener_insumos_por_proveedor(id_proveedor):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT i.*, p.nombre_proveedor 
        FROM Insumos i 
        JOIN Proveedores p ON i.id_proveedor = p.id_proveedor 
        WHERE i.id_proveedor = %s
    """, (id_proveedor,))
    insumos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(insumos) 