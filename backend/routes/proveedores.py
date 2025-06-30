from flask import Blueprint, jsonify, request
from db import get_connection

proveedores_bp = Blueprint('proveedores', __name__, url_prefix='/proveedores')

@proveedores_bp.route('/', methods=['GET'])
def listar_proveedores():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT p.*, COUNT(i.id_insumo) as cantidad_insumos
        FROM Proveedores p
        LEFT JOIN Insumos i ON p.id_proveedor = i.id_proveedor
        GROUP BY p.id_proveedor
        ORDER BY p.nombre_proveedor
    """
    cursor.execute(query)
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

@proveedores_bp.route('/', methods=['POST'])
def crear_proveedor():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        INSERT INTO Proveedores (nombre_proveedor, telefono, email, direccion)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query, (
        data['nombre_proveedor'],
        data.get('telefono'),
        data.get('email'),
        data.get('direccion')
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Proveedor creado correctamente'}), 201

@proveedores_bp.route('/<int:id_proveedor>', methods=['PUT'])
def actualizar_proveedor(id_proveedor):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        UPDATE Proveedores 
        SET nombre_proveedor = %s, telefono = %s, email = %s, direccion = %s
        WHERE id_proveedor = %s
    """
    cursor.execute(query, (
        data['nombre_proveedor'],
        data.get('telefono'),
        data.get('email'),
        data.get('direccion'),
        id_proveedor
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Proveedor actualizado correctamente'})

@proveedores_bp.route('/<int:id_proveedor>', methods=['DELETE'])
def eliminar_proveedor(id_proveedor):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Verificar si el proveedor tiene insumos asociados
    cursor.execute("SELECT COUNT(*) as count FROM Insumos WHERE id_proveedor = %s", (id_proveedor,))
    result = cursor.fetchone()
    if result[0] > 0:
        cursor.close()
        conn.close()
        return jsonify({'error': 'No se puede eliminar un proveedor que tiene insumos asociados'}), 400
    
    cursor.execute("DELETE FROM Proveedores WHERE id_proveedor = %s", (id_proveedor,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Proveedor eliminado correctamente'})

@proveedores_bp.route('/<int:id_proveedor>/insumos', methods=['GET'])
def insumos_proveedor(id_proveedor):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT i.*
        FROM Insumos i
        WHERE i.id_proveedor = %s
        ORDER BY i.nombre_insumo
    """
    cursor.execute(query, (id_proveedor,))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data) 