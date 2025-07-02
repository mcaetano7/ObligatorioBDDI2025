from flask import Blueprint, request, jsonify
from db import get_connection
from datetime import datetime

ventas_bp = Blueprint('ventas', __name__, url_prefix='/ventas')

# Obtener todas las ventas
@ventas_bp.route('/', methods=['GET'])
def listar_ventas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT v.*, c.nombre_cafe, c.precio_venta, m.modelo as nombre_maquina, m.marca
        FROM Ventas v
        JOIN Cafes c ON v.id_cafe = c.id_cafe
        JOIN Alquileres a ON v.id_alquiler = a.id_alquiler
        JOIN Maquinas m ON a.id_maquina = m.id_maquina
        ORDER BY v.fecha_venta DESC
    """
    cursor.execute(query)
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

# Registrar una nueva venta
@ventas_bp.route('/', methods=['POST'])
def registrar_venta():
    data = request.json
    required_fields = ['maquina_id', 'cafe_id', 'cantidad']
    if not all(field in data and data[field] != '' for field in required_fields):
        return jsonify({'error': 'Faltan datos obligatorios'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    
    # Obtener alquiler activo de la máquina
    cursor.execute("""
        SELECT id_alquiler FROM Alquileres 
        WHERE id_maquina = %s AND fecha_fin IS NULL
    """, (data['maquina_id'],))
    
    alquiler = cursor.fetchone()
    if not alquiler:
        cursor.close()
        conn.close()
        return jsonify({'error': 'No hay un alquiler activo para esta máquina'}), 400
    
    id_alquiler = alquiler[0]
    
    # Obtener precio del café
    cursor.execute("SELECT precio_venta FROM Cafes WHERE id_cafe = %s", (data['cafe_id'],))
    cafe = cursor.fetchone()
    if not cafe:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Café no encontrado'}), 404
    
    precio_unitario = cafe[0]
    
    # Insertar venta
    query = """
        INSERT INTO Ventas (id_alquiler, id_cafe, cantidad, precio_unitario, fecha_venta)
        VALUES (%s, %s, %s, %s, %s)
    """
    fecha_venta = data.get('fecha', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    cursor.execute(query, (
        id_alquiler,
        data['cafe_id'],
        data['cantidad'],
        precio_unitario,
        fecha_venta
    ))
    
    # Calcular y registrar ganancias en GananciasMaquina
    # Obtener porcentaje de ganancia de la máquina
    cursor.execute("""
        SELECT m.porcentaje_ganancia_empresa, a.id_alquiler
        FROM Alquileres a
        JOIN Maquinas m ON a.id_maquina = m.id_maquina
        WHERE a.id_alquiler = %s
    """, (data['id_alquiler'],))
    
    resultado = cursor.fetchone()
    if resultado:
        porcentaje_ganancia = resultado[0]
        id_alquiler = resultado[1]
        
        # Calcular ganancias
        ventas_totales = data['cantidad'] * precio_unitario
        ganancia_empresa = ventas_totales * (porcentaje_ganancia / 100)
        ganancia_cliente = ventas_totales - ganancia_empresa
        
        # Obtener mes y año actual
        fecha_actual = datetime.now()
        mes = fecha_actual.month
        anio = fecha_actual.year
        
        # Verificar si ya existe un registro para este alquiler, mes y año
        cursor.execute("""
            SELECT id_ganancia FROM GananciasMaquina 
            WHERE id_alquiler = %s AND mes = %s AND anio = %s
        """, (id_alquiler, mes, anio))
        
        ganancia_existente = cursor.fetchone()
        
        if ganancia_existente:
            # Actualizar registro existente
            cursor.execute("""
                UPDATE GananciasMaquina 
                SET ganancia_cliente = ganancia_cliente + %s,
                    ganancia_empresa = ganancia_empresa + %s,
                    total_ventas = total_ventas + %s
                WHERE id_alquiler = %s AND mes = %s AND anio = %s
            """, (ganancia_cliente, ganancia_empresa, ventas_totales, id_alquiler, mes, anio))
        else:
            # Crear nuevo registro
            cursor.execute("""
                INSERT INTO GananciasMaquina (id_alquiler, mes, anio, ganancia_cliente, ganancia_empresa, total_ventas)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (id_alquiler, mes, anio, ganancia_cliente, ganancia_empresa, ventas_totales))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Venta registrada correctamente'}), 201

# Obtener ventas por alquiler
@ventas_bp.route('/alquiler/<int:id_alquiler>', methods=['GET'])
def ventas_alquiler(id_alquiler):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT v.*, c.nombre_cafe, c.precio_venta
        FROM Ventas v
        JOIN Cafes c ON v.id_cafe = c.id_cafe
        WHERE v.id_alquiler = %s
        ORDER BY v.fecha_venta DESC
    """
    cursor.execute(query, (id_alquiler,))
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

# Obtener ventas por período
@ventas_bp.route('/periodo', methods=['GET'])
def ventas_periodo():
    mes = request.args.get('mes')
    anio = request.args.get('anio')
    
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    if mes and anio:
        query = """
            SELECT v.*, c.nombre_cafe, c.precio_venta, cl.nombre_empresa, m.modelo, m.marca
            FROM Ventas v
            JOIN Cafes c ON v.id_cafe = c.id_cafe
            JOIN Alquileres a ON v.id_alquiler = a.id_alquiler
            JOIN Clientes cl ON a.id_cliente = cl.id_cliente
            JOIN Maquinas m ON a.id_maquina = m.id_maquina
            WHERE MONTH(v.fecha_venta) = %s AND YEAR(v.fecha_venta) = %s
            ORDER BY v.fecha_venta DESC
        """
        cursor.execute(query, (mes, anio))
    else:
        query = """
            SELECT v.*, c.nombre_cafe, c.precio_venta, cl.nombre_empresa, m.modelo, m.marca
            FROM Ventas v
            JOIN Cafes c ON v.id_cafe = c.id_cafe
            JOIN Alquileres a ON v.id_alquiler = a.id_alquiler
            JOIN Clientes cl ON a.id_cliente = cl.id_cliente
            JOIN Maquinas m ON a.id_maquina = m.id_maquina
            WHERE v.fecha_venta >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            ORDER BY v.fecha_venta DESC
        """
        cursor.execute(query)
    
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

# Reporte de ventas por café
@ventas_bp.route('/reporte-cafes', methods=['GET'])
def reporte_ventas_cafes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            c.nombre_cafe,
            c.precio_venta,
            COUNT(v.id_venta) as total_ventas,
            SUM(v.cantidad) as cantidad_total,
            SUM(v.cantidad * v.precio_unitario) as ingresos_totales,
            ROUND(SUM(v.cantidad * v.precio_unitario) / SUM(v.cantidad), 2) as precio_promedio
        FROM Cafes c
        LEFT JOIN Ventas v ON c.id_cafe = v.id_cafe
        GROUP BY c.id_cafe, c.nombre_cafe, c.precio_venta
        ORDER BY ingresos_totales DESC
    """
    cursor.execute(query)
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

# Reporte de ventas por máquina
@ventas_bp.route('/reporte-maquinas', methods=['GET'])
def reporte_ventas_maquinas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            m.modelo,
            m.marca,
            COUNT(DISTINCT v.id_venta) as total_ventas,
            SUM(v.cantidad) as cantidad_total,
            SUM(v.cantidad * v.precio_unitario) as ingresos_totales,
            ROUND(SUM(v.cantidad * v.precio_unitario) / COUNT(DISTINCT v.id_venta), 2) as promedio_por_venta
        FROM Maquinas m
        LEFT JOIN Alquileres a ON m.id_maquina = a.id_maquina
        LEFT JOIN Ventas v ON a.id_alquiler = v.id_alquiler
        GROUP BY m.id_maquina, m.modelo, m.marca
        ORDER BY ingresos_totales DESC
    """
    cursor.execute(query)
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)

# Eliminar venta
@ventas_bp.route('/<int:id_venta>', methods=['DELETE'])
def eliminar_venta(id_venta):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Obtener datos de la venta antes de eliminarla
    cursor.execute("""
        SELECT v.*, a.id_alquiler, m.porcentaje_ganancia_empresa
        FROM Ventas v
        JOIN Alquileres a ON v.id_alquiler = a.id_alquiler
        JOIN Maquinas m ON a.id_maquina = m.id_maquina
        WHERE v.id_venta = %s
    """, (id_venta,))
    
    venta = cursor.fetchone()
    if not venta:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Venta no encontrada'}), 404
    
    # Calcular ganancias a restar
    ventas_totales = venta[4] * venta[5]  # cantidad * precio_unitario
    ganancia_empresa = ventas_totales * (venta[8] / 100)  # porcentaje_ganancia_empresa
    ganancia_cliente = ventas_totales - ganancia_empresa
    
    # Obtener mes y año de la venta
    fecha_venta = venta[6]  # fecha_venta
    mes = fecha_venta.month
    anio = fecha_venta.year
    
    # Actualizar ganancias
    cursor.execute("""
        UPDATE GananciasMaquina 
        SET ganancia_cliente = ganancia_cliente - %s,
            ganancia_empresa = ganancia_empresa - %s,
            total_ventas = total_ventas - %s
        WHERE id_alquiler = %s AND mes = %s AND anio = %s
    """, (ganancia_cliente, ganancia_empresa, ventas_totales, venta[7], mes, anio))
    
    # Eliminar venta
    cursor.execute("DELETE FROM Ventas WHERE id_venta = %s", (id_venta,))
    
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'mensaje': 'Venta eliminada correctamente'}) 