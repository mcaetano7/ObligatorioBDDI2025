from flask import Blueprint, jsonify, request
from db import get_connection

insumos_bp = Blueprint('insumos', __name__, url_prefix='/insumos')

@insumos_bp.route('/', methods=['GET'])
def listar_insumos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT i.*, p.nombre_proveedor
        FROM Insumos i
        LEFT JOIN Proveedores p ON i.id_proveedor = p.id_proveedor
        ORDER BY i.nombre_insumo
    """
    cursor.execute(query)
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

@insumos_bp.route('/', methods=['POST'])
def crear_insumo():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    # Validar datos requeridos
    if not all(key in data for key in ['nombre_insumo', 'unidad_medida', 'costo_unitario']):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    # Convertir costo_unitario a float
    try:
        costo_unitario = float(data['costo_unitario'])
    except (ValueError, TypeError):
        return jsonify({'error': 'El costo unitario debe ser un número válido'}), 400
    
    # Manejar id_proveedor (puede ser None si no se proporciona)
    id_proveedor = data.get('id_proveedor')
    if id_proveedor == '' or id_proveedor is None:
        id_proveedor = None
    else:
        try:
            id_proveedor = int(id_proveedor)
        except (ValueError, TypeError):
            return jsonify({'error': 'El ID del proveedor debe ser un número válido'}), 400
    
    query = """
        INSERT INTO Insumos (nombre_insumo, unidad_medida, costo_unitario, id_proveedor)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query, (
        data['nombre_insumo'],
        data['unidad_medida'],
        costo_unitario,
        id_proveedor
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Insumo creado correctamente'}), 201

@insumos_bp.route('/<int:id_insumo>', methods=['PUT'])
def actualizar_insumo(id_insumo):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    # Validar datos requeridos
    if not all(key in data for key in ['nombre_insumo', 'unidad_medida', 'costo_unitario']):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    # Convertir costo_unitario a float
    try:
        costo_unitario = float(data['costo_unitario'])
    except (ValueError, TypeError):
        return jsonify({'error': 'El costo unitario debe ser un número válido'}), 400
    
    # Manejar id_proveedor (puede ser None si no se proporciona)
    id_proveedor = data.get('id_proveedor')
    if id_proveedor == '' or id_proveedor is None:
        id_proveedor = None
    else:
        try:
            id_proveedor = int(id_proveedor)
        except (ValueError, TypeError):
            return jsonify({'error': 'El ID del proveedor debe ser un número válido'}), 400
    
    query = """
        UPDATE Insumos 
        SET nombre_insumo = %s, unidad_medida = %s, costo_unitario = %s, id_proveedor = %s
        WHERE id_insumo = %s
    """
    cursor.execute(query, (
        data['nombre_insumo'],
        data['unidad_medida'],
        costo_unitario,
        id_proveedor,
        id_insumo
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Insumo actualizado correctamente'})

@insumos_bp.route('/<int:id_insumo>', methods=['DELETE'])
def eliminar_insumo(id_insumo):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Verificar si el insumo está siendo usado
    cursor.execute("SELECT COUNT(*) as count FROM ConsumoInsumos WHERE id_insumo = %s", (id_insumo,))
    result = cursor.fetchone()
    if result[0] > 0:
        cursor.close()
        conn.close()
        return jsonify({'error': 'No se puede eliminar un insumo que tiene registros de consumo'}), 400
    
    cursor.execute("DELETE FROM Insumos WHERE id_insumo = %s", (id_insumo,))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Insumo eliminado correctamente'})

@insumos_bp.route('/consumo', methods=['POST'])
def registrar_consumo():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    # Validar datos requeridos
    if not all(key in data for key in ['id_alquiler', 'id_insumo', 'cantidad_consumida']):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    
    # Usar fecha actual si no se proporciona
    fecha_consumo = data.get('fecha_consumo')
    if not fecha_consumo:
        from datetime import date
        fecha_consumo = date.today().isoformat()
    
    query = """
        INSERT INTO ConsumoInsumos (id_alquiler, id_insumo, cantidad_consumida, fecha_consumo)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query, (
        data['id_alquiler'],
        data['id_insumo'],
        data['cantidad_consumida'],
        fecha_consumo
    ))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Consumo registrado correctamente'}), 201

@insumos_bp.route('/consumo/<int:id_alquiler>', methods=['GET'])
def obtener_consumo_alquiler(id_alquiler):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT ci.*, i.nombre_insumo, i.unidad_medida, i.costo_unitario
        FROM ConsumoInsumos ci
        JOIN Insumos i ON ci.id_insumo = i.id_insumo
        WHERE ci.id_alquiler = %s
        ORDER BY ci.fecha_consumo DESC
    """
    cursor.execute(query, (id_alquiler,))
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@insumos_bp.route('/reporte-consumo', methods=['GET'])
def reporte_consumo():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            i.nombre_insumo,
            i.unidad_medida,
            SUM(ci.cantidad_consumida) as total_consumido,
            SUM(ci.cantidad_consumida * i.costo_unitario) as costo_total,
            COUNT(ci.id_consumo) as veces_consumido
        FROM Insumos i
        LEFT JOIN ConsumoInsumos ci ON i.id_insumo = ci.id_insumo
        GROUP BY i.id_insumo, i.nombre_insumo, i.unidad_medida
        ORDER BY total_consumido DESC
    """
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@insumos_bp.route('/consumo/<int:id_consumo>', methods=['DELETE'])
def eliminar_consumo(id_consumo):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM ConsumoInsumos WHERE id_consumo = %s", (id_consumo,))
        if cursor.rowcount == 0:
            return jsonify({'error': 'Consumo no encontrado'}), 404
        conn.commit()
        return jsonify({'mensaje': 'Consumo eliminado correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()