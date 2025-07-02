from flask import Blueprint, request, jsonify
from db import get_connection

cafes_bp = Blueprint('cafes', __name__, url_prefix='/cafes')

# Obtener todos los cafés
@cafes_bp.route('/', methods=['GET'])
def listar_cafes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT c.*, 
               GROUP_CONCAT(i.nombre_insumo SEPARATOR ', ') as insumos
        FROM Cafes c
        LEFT JOIN CafeInsumos ci ON c.id_cafe = ci.id_cafe
        LEFT JOIN Insumos i ON ci.id_insumo = i.id_insumo
        GROUP BY c.id_cafe
        ORDER BY c.nombre_cafe
    """
    cursor.execute(query)
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

# Crear nuevo café
@cafes_bp.route('/', methods=['POST'])
def crear_cafe():
    data = request.json
    required_fields = ['nombre_cafe', 'precio_venta']
    if not all(field in data and data[field] != '' for field in required_fields):
        return jsonify({'error': 'Faltan datos obligatorios'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    
    # Insertar café
    query = """
        INSERT INTO Cafes (nombre_cafe, precio_venta, descripcion)
        VALUES (%s, %s, %s)
    """
    cursor.execute(query, (
        data['nombre_cafe'],
        data['precio_venta'],
        data.get('descripcion', '')
    ))
    id_cafe = cursor.lastrowid
    
    # Insertar insumos si se proporcionan
    if 'insumos' in data and data['insumos']:
        for insumo in data['insumos']:
            cursor.execute("""
                INSERT INTO CafeInsumos (id_cafe, id_insumo, cantidad_por_servicio)
                VALUES (%s, %s, %s)
            """, (id_cafe, insumo['id_insumo'], insumo['cantidad']))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Café creado correctamente', 'id_cafe': id_cafe}), 201

# Obtener un café específico con sus insumos
@cafes_bp.route('/<int:id_cafe>', methods=['GET'])
def obtener_cafe(id_cafe):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Obtener datos del café
    cursor.execute("SELECT * FROM Cafes WHERE id_cafe = %s", (id_cafe,))
    cafe = cursor.fetchone()
    
    if not cafe:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Café no encontrado'}), 404
    
    # Obtener insumos del café
    cursor.execute("""
        SELECT ci.*, i.nombre_insumo, i.unidad_medida
        FROM CafeInsumos ci
        JOIN Insumos i ON ci.id_insumo = i.id_insumo
        WHERE ci.id_cafe = %s
    """, (id_cafe,))
    insumos = cursor.fetchall()
    
    cafe['insumos'] = insumos
    cursor.close()
    conn.close()
    return jsonify(cafe)

# Actualizar café
@cafes_bp.route('/<int:id_cafe>', methods=['PUT'])
def actualizar_cafe(id_cafe):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
        UPDATE Cafes 
        SET nombre_cafe = %s, precio_venta = %s, descripcion = %s
        WHERE id_cafe = %s
    """
    cursor.execute(query, (
        data.get('nombre_cafe'),
        data.get('precio_venta'),
        data.get('descripcion', ''),
        id_cafe
    ))
    
    # Actualizar insumos si se proporcionan
    if 'insumos' in data:
        # Eliminar insumos actuales
        cursor.execute("DELETE FROM CafeInsumos WHERE id_cafe = %s", (id_cafe,))
        # Insertar nuevos insumos
        if data['insumos']:
            for insumo in data['insumos']:
                cursor.execute("""
                    INSERT INTO CafeInsumos (id_cafe, id_insumo, cantidad_por_servicio)
                    VALUES (%s, %s, %s)
                """, (id_cafe, insumo['id_insumo'], insumo['cantidad']))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Café actualizado correctamente'})

# Eliminar café
@cafes_bp.route('/<int:id_cafe>', methods=['DELETE'])
def eliminar_cafe(id_cafe):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Verificar si el café está siendo usado en ventas
    cursor.execute("SELECT COUNT(*) as count FROM Ventas WHERE id_cafe = %s", (id_cafe,))
    result = cursor.fetchone()
    if result[0] > 0:
        cursor.close()
        conn.close()
        return jsonify({'error': 'No se puede eliminar un café que tiene ventas registradas'}), 400
    
    # Eliminar insumos del café
    cursor.execute("DELETE FROM CafeInsumos WHERE id_cafe = %s", (id_cafe,))
    # Eliminar asignaciones a máquinas
    cursor.execute("DELETE FROM MaquinaCafes WHERE id_cafe = %s", (id_cafe,))
    # Eliminar café
    cursor.execute("DELETE FROM Cafes WHERE id_cafe = %s", (id_cafe,))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Café eliminado correctamente'})

# Obtener cafés de una máquina específica
@cafes_bp.route('/maquina/<int:id_maquina>', methods=['GET'])
def cafes_maquina(id_maquina):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT c.*
        FROM Cafes c
        JOIN MaquinaCafes mc ON c.id_cafe = mc.id_cafe
        WHERE mc.id_maquina = %s
        ORDER BY c.nombre_cafe
    """
    cursor.execute(query, (id_maquina,))
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

# Asignar cafés a una máquina
@cafes_bp.route('/maquina/<int:id_maquina>/asignar', methods=['POST'])
def asignar_cafes_maquina(id_maquina):
    data = request.json
    cafes_ids = data.get('cafes', [])
    
    conn = get_connection()
    cursor = conn.cursor()
    
    # Eliminar asignaciones actuales
    cursor.execute("DELETE FROM MaquinaCafes WHERE id_maquina = %s", (id_maquina,))
    
    # Insertar nuevas asignaciones
    for id_cafe in cafes_ids:
        cursor.execute("""
            INSERT INTO MaquinaCafes (id_maquina, id_cafe)
            VALUES (%s, %s)
        """, (id_maquina, id_cafe))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Cafés asignados correctamente a la máquina'}) 