from flask import Blueprint, request, jsonify
from db import get_connection
from datetime import datetime

venta_bp = Blueprint('venta', __name__, url_prefix='/venta')

# Obtener ventas por período
@venta_bp.route('/periodo', methods=['GET'])
def obtener_ventas_por_periodo():
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    
    if not fecha_inicio or not fecha_fin:
        return jsonify({'error': 'Se requieren fecha_inicio y fecha_fin'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT v.*, c.nombre_cafe, a.id_cliente, cl.nombre_empresa
        FROM Ventas v 
        JOIN Cafes c ON v.id_cafe = c.id_cafe 
        JOIN Alquileres a ON v.id_alquiler = a.id_alquiler 
        JOIN Clientes cl ON a.id_cliente = cl.id_cliente
        WHERE v.fecha_venta BETWEEN %s AND %s
        ORDER BY v.fecha_venta DESC
    """, (fecha_inicio, fecha_fin))
    ventas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(ventas)

# Obtener consumo de insumos por período
@venta_bp.route('/consumo-insumos', methods=['GET'])
def obtener_consumo_insumos():
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    
    if not fecha_inicio or not fecha_fin:
        return jsonify({'error': 'Se requieren fecha_inicio y fecha_fin'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT ci.*, i.nombre_insumo, a.id_cliente, cl.nombre_empresa
        FROM ConsumoInsumos ci 
        JOIN Insumos i ON ci.id_insumo = i.id_insumo 
        JOIN Alquileres a ON ci.id_alquiler = a.id_alquiler 
        JOIN Clientes cl ON a.id_cliente = cl.id_cliente
        WHERE ci.fecha_consumo BETWEEN %s AND %s
        ORDER BY ci.fecha_consumo DESC
    """, (fecha_inicio, fecha_fin))
    consumos = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(consumos)

# Obtener alquileres activos con información completa
@venta_bp.route('/alquileres-activos', methods=['GET'])
def obtener_alquileres_activos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT a.*, c.nombre_empresa, m.modelo, m.marca 
        FROM Alquileres a 
        JOIN Clientes c ON a.id_cliente = c.id_cliente 
        JOIN Maquinas m ON a.id_maquina = m.id_maquina 
        WHERE a.fecha_fin >= CURDATE()
        ORDER BY a.fecha_inicio DESC
    """)
    alquileres = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(alquileres)

# Obtener estadísticas de ventas
@venta_bp.route('/estadisticas', methods=['GET'])
def obtener_estadisticas_ventas():
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    
    if not fecha_inicio or not fecha_fin:
        return jsonify({'error': 'Se requieren fecha_inicio y fecha_fin'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Total de ventas por período
    cursor.execute("""
        SELECT COUNT(*) as total_ventas, SUM(v.precio_venta) as total_ingresos
        FROM Ventas v 
        WHERE v.fecha_venta BETWEEN %s AND %s
    """, (fecha_inicio, fecha_fin))
    stats_ventas = cursor.fetchone()
    
    # Ventas por café
    cursor.execute("""
        SELECT c.nombre_cafe, COUNT(*) as cantidad_vendida, SUM(v.precio_venta) as ingresos
        FROM Ventas v 
        JOIN Cafes c ON v.id_cafe = c.id_cafe 
        WHERE v.fecha_venta BETWEEN %s AND %s
        GROUP BY c.id_cafe, c.nombre_cafe
        ORDER BY cantidad_vendida DESC
    """, (fecha_inicio, fecha_fin))
    ventas_por_cafe = cursor.fetchall()
    
    # Ventas por cliente
    cursor.execute("""
        SELECT cl.nombre_empresa, COUNT(*) as cantidad_ventas, SUM(v.precio_venta) as ingresos
        FROM Ventas v 
        JOIN Alquileres a ON v.id_alquiler = a.id_alquiler 
        JOIN Clientes cl ON a.id_cliente = cl.id_cliente
        WHERE v.fecha_venta BETWEEN %s AND %s
        GROUP BY cl.id_cliente, cl.nombre_empresa
        ORDER BY ingresos DESC
    """, (fecha_inicio, fecha_fin))
    ventas_por_cliente = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify({
        'estadisticas_generales': stats_ventas,
        'ventas_por_cafe': ventas_por_cafe,
        'ventas_por_cliente': ventas_por_cliente
    })

# Obtener reporte de costos y rendimiento
@venta_bp.route('/costos-rendimiento', methods=['GET'])
def obtener_costos_rendimiento():
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    
    if not fecha_inicio or not fecha_fin:
        return jsonify({'error': 'Se requieren fecha_inicio y fecha_fin'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Costos de insumos por período
    cursor.execute("""
        SELECT 
            i.nombre_insumo,
            SUM(ci.cantidad_consumida) as total_consumido,
            i.unidad_medida,
            SUM(ci.cantidad_consumida * i.costo_unitario) as costo_total
        FROM ConsumoInsumos ci 
        JOIN Insumos i ON ci.id_insumo = i.id_insumo 
        WHERE ci.fecha_consumo BETWEEN %s AND %s
        GROUP BY i.id_insumo, i.nombre_insumo, i.unidad_medida
        ORDER BY costo_total DESC
    """, (fecha_inicio, fecha_fin))
    costos_insumos = cursor.fetchall()
    
    # Rendimiento por máquina
    cursor.execute("""
        SELECT 
            m.modelo,
            m.marca,
            COUNT(v.id_venta) as total_ventas,
            SUM(v.precio_venta) as ingresos_totales,
            SUM(ci.cantidad_consumida * i.costo_unitario) as costos_insumos
        FROM Maquinas m
        LEFT JOIN Alquileres a ON m.id_maquina = a.id_maquina
        LEFT JOIN Ventas v ON a.id_alquiler = v.id_alquiler AND v.fecha_venta BETWEEN %s AND %s
        LEFT JOIN ConsumoInsumos ci ON a.id_alquiler = ci.id_alquiler AND ci.fecha_consumo BETWEEN %s AND %s
        LEFT JOIN Insumos i ON ci.id_insumo = i.id_insumo
        WHERE a.fecha_inicio <= %s AND a.fecha_fin >= %s
        GROUP BY m.id_maquina, m.modelo, m.marca
        ORDER BY ingresos_totales DESC
    """, (fecha_inicio, fecha_fin, fecha_inicio, fecha_fin, fecha_fin, fecha_inicio))
    rendimiento_maquinas = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return jsonify({
        'costos_insumos': costos_insumos,
        'rendimiento_maquinas': rendimiento_maquinas
    })

# Obtener reporte de ganancias
@venta_bp.route('/ganancias', methods=['GET'])
def obtener_ganancias():
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    
    if not fecha_inicio or not fecha_fin:
        return jsonify({'error': 'Se requieren fecha_inicio y fecha_fin'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Ganancias por máquina (ahora incluye id_alquiler y nombre_empresa)
    cursor.execute("""
        SELECT 
            m.modelo,
            m.marca,
            gm.mes,
            gm.anio,
            gm.ganancia_cliente,
            gm.ganancia_empresa,
            gm.total_ventas,
            a.id_alquiler,
            cl.nombre_empresa
        FROM GananciasMaquina gm
        JOIN Alquileres a ON gm.id_alquiler = a.id_alquiler
        JOIN Maquinas m ON a.id_maquina = m.id_maquina
        JOIN Clientes cl ON a.id_cliente = cl.id_cliente
        WHERE gm.anio BETWEEN YEAR(%s) AND YEAR(%s)
        AND (gm.anio > YEAR(%s) OR (gm.anio = YEAR(%s) AND gm.mes >= MONTH(%s)))
        AND (gm.anio < YEAR(%s) OR (gm.anio = YEAR(%s) AND gm.mes <= MONTH(%s)))
        ORDER BY gm.anio DESC, gm.mes DESC
    """, (fecha_inicio, fecha_fin, fecha_inicio, fecha_inicio, fecha_inicio, fecha_fin, fecha_fin, fecha_fin))
    ganancias_maquinas = cursor.fetchall()
    
    # Ganancias totales
    cursor.execute("""
        SELECT 
            SUM(gm.ganancia_cliente) as total_ganancia_clientes,
            SUM(gm.ganancia_empresa) as total_ganancia_empresa,
            SUM(gm.total_ventas) as total_ventas
        FROM GananciasMaquina gm
        WHERE gm.anio BETWEEN YEAR(%s) AND YEAR(%s)
        AND (gm.anio > YEAR(%s) OR (gm.anio = YEAR(%s) AND gm.mes >= MONTH(%s)))
        AND (gm.anio < YEAR(%s) OR (gm.anio = YEAR(%s) AND gm.mes <= MONTH(%s)))
    """, (fecha_inicio, fecha_fin, fecha_inicio, fecha_inicio, fecha_inicio, fecha_fin, fecha_fin, fecha_fin))
    ganancias_totales = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    return jsonify({
        'ganancias_maquinas': ganancias_maquinas,
        'ganancias_totales': ganancias_totales
    })

# Obtener cafés disponibles para un alquiler (los cafés asociados a la máquina de ese alquiler)
@venta_bp.route('/cafes-disponibles/<int:id_alquiler>', methods=['GET'])
def cafes_disponibles_para_alquiler(id_alquiler):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    # Obtener la máquina asociada al alquiler
    cursor.execute("SELECT id_maquina FROM Alquileres WHERE id_alquiler = %s", (id_alquiler,))
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Alquiler no encontrado'}), 404
    id_maquina = row['id_maquina'] if isinstance(row, dict) else row[0]
    # Obtener cafés asociados a la máquina
    cursor.execute('''
        SELECT c.id_cafe, c.nombre_cafe, c.precio_venta, c.descripcion
        FROM Cafes c
        JOIN MaquinaCafes mc ON c.id_cafe = mc.id_cafe
        WHERE mc.id_maquina = %s
    ''', (id_maquina,))
    cafes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(cafes)

# Registrar una venta
@venta_bp.route('/', methods=['POST'])
def registrar_venta():
    data = request.get_json()
    id_alquiler = data.get('id_alquiler')
    id_cafe = data.get('id_cafe')
    cantidad = data.get('cantidad')
    # Obtener el precio_unitario del café
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT precio_venta FROM Cafes WHERE id_cafe = %s", (id_cafe,))
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return jsonify({'error': 'Café no encontrado'}), 404
    precio_unitario = float(row['precio_venta'] if isinstance(row, dict) else row[0])
    try:
        # Registrar la venta
        cursor.execute('''
            INSERT INTO Ventas (id_alquiler, id_cafe, cantidad, precio_unitario)
            VALUES (%s, %s, %s, %s)
        ''', (id_alquiler, id_cafe, cantidad, precio_unitario))
        conn.commit()
        # Registrar consumo de insumos
        # 1. Obtener insumos y cantidades por servicio para el café vendido
        cursor.execute('''
            SELECT id_insumo, cantidad_por_servicio
            FROM CafeInsumos
            WHERE id_cafe = %s
        ''', (id_cafe,))
        insumos = cursor.fetchall()
        # 2. Insertar consumo de insumos (cantidad_por_servicio * cantidad vendida)
        for insumo in insumos:
            id_insumo = insumo['id_insumo']
            cantidad_consumida = float(insumo['cantidad_por_servicio']) * int(cantidad)
            cursor.execute('''
                INSERT INTO ConsumoInsumos (id_alquiler, id_insumo, cantidad_consumida, fecha_consumo)
                VALUES (%s, %s, %s, CURDATE())
            ''', (id_alquiler, id_insumo, cantidad_consumida))
        conn.commit()
        # Obtener fecha actual, mes y año
        now = datetime.now()
        mes = now.month
        anio = now.year
        # Obtener datos del alquiler y máquina
        cursor.execute("SELECT a.coste_total_alquiler, m.porcentaje_ganancia_empresa FROM Alquileres a JOIN Maquinas m ON a.id_maquina = m.id_maquina WHERE a.id_alquiler = %s", (id_alquiler,))
        datos = cursor.fetchone()
        if not datos:
            raise Exception('Alquiler o máquina no encontrados')
        coste_total_alquiler = float(datos['coste_total_alquiler'])
        porcentaje_empresa = float(datos['porcentaje_ganancia_empresa'])
        # Calcular el total de ventas del mes para ese alquiler
        cursor.execute("""
            SELECT SUM(cantidad * precio_unitario) as total_ventas
            FROM Ventas
            WHERE id_alquiler = %s AND MONTH(fecha_venta) = %s AND YEAR(fecha_venta) = %s
        """, (id_alquiler, mes, anio))
        total_ventas_row = cursor.fetchone()
        total_ventas = float(total_ventas_row['total_ventas'] or 0)
        # Calcular ganancias
        ganancia_empresa = (porcentaje_empresa * total_ventas / 100) + coste_total_alquiler
        ganancia_cliente = total_ventas - ganancia_empresa
        # Verificar si ya existe registro en GananciasMaquina
        cursor.execute("SELECT id_ganancia FROM GananciasMaquina WHERE id_alquiler = %s AND mes = %s AND anio = %s", (id_alquiler, mes, anio))
        existe = cursor.fetchone()
        if existe:
            # Actualizar
            cursor.execute("""
                UPDATE GananciasMaquina
                SET ganancia_cliente = %s, ganancia_empresa = %s, total_ventas = %s
                WHERE id_alquiler = %s AND mes = %s AND anio = %s
            """, (ganancia_cliente, ganancia_empresa, total_ventas, id_alquiler, mes, anio))
        else:
            # Insertar
            cursor.execute("""
                INSERT INTO GananciasMaquina (id_alquiler, mes, anio, ganancia_cliente, ganancia_empresa, total_ventas)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (id_alquiler, mes, anio, ganancia_cliente, ganancia_empresa, total_ventas))
        conn.commit()
        return jsonify({'mensaje': 'Venta registrada correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

@venta_bp.route('/costos-insumos', methods=['GET'])
def obtener_costos_insumos():
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    if not fecha_inicio or not fecha_fin:
        return jsonify({'error': 'Se requieren fecha_inicio y fecha_fin'}), 400
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('''
        SELECT 
            a.id_alquiler,
            cl.nombre_empresa,
            m.modelo,
            m.marca,
            MONTH(ci.fecha_consumo) as mes,
            YEAR(ci.fecha_consumo) as anio,
            SUM(ci.cantidad_consumida * i.costo_unitario) as costo_total_insumos
        FROM ConsumoInsumos ci
        JOIN Alquileres a ON ci.id_alquiler = a.id_alquiler
        JOIN Clientes cl ON a.id_cliente = cl.id_cliente
        JOIN Maquinas m ON a.id_maquina = m.id_maquina
        JOIN Insumos i ON ci.id_insumo = i.id_insumo
        WHERE ci.fecha_consumo BETWEEN %s AND %s
        GROUP BY a.id_alquiler, cl.nombre_empresa, m.modelo, m.marca, mes, anio
        ORDER BY anio DESC, mes DESC, a.id_alquiler
    ''', (fecha_inicio, fecha_fin))
    costos = cursor.fetchall()
    # Totales generales del período
    cursor.execute('''
        SELECT SUM(ci.cantidad_consumida * i.costo_unitario) as total_costos_insumos
        FROM ConsumoInsumos ci
        JOIN Insumos i ON ci.id_insumo = i.id_insumo
        WHERE ci.fecha_consumo BETWEEN %s AND %s
    ''', (fecha_inicio, fecha_fin))
    totales = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify({
        'costos_insumos': costos,
        'costos_totales': totales
    })

@venta_bp.route('/insumo-mayor-costo', methods=['GET'])
def insumo_mayor_costo():
    fecha_inicio = request.args.get('fecha_inicio')
    fecha_fin = request.args.get('fecha_fin')
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    if fecha_inicio and fecha_fin:
        cursor.execute('''
            SELECT 
                i.id_insumo,
                i.nombre_insumo,
                i.unidad_medida,
                SUM(ci.cantidad_consumida) as total_consumido,
                SUM(ci.cantidad_consumida * i.costo_unitario) as costo_total
            FROM ConsumoInsumos ci
            JOIN Insumos i ON ci.id_insumo = i.id_insumo
            WHERE ci.fecha_consumo BETWEEN %s AND %s
            GROUP BY i.id_insumo, i.nombre_insumo, i.unidad_medida
            ORDER BY costo_total DESC
            LIMIT 1
        ''', (fecha_inicio, fecha_fin))
    else:
        cursor.execute('''
            SELECT 
                i.id_insumo,
                i.nombre_insumo,
                i.unidad_medida,
                SUM(ci.cantidad_consumida) as total_consumido,
                SUM(ci.cantidad_consumida * i.costo_unitario) as costo_total
            FROM ConsumoInsumos ci
            JOIN Insumos i ON ci.id_insumo = i.id_insumo
            GROUP BY i.id_insumo, i.nombre_insumo, i.unidad_medida
            ORDER BY costo_total DESC
            LIMIT 1
        ''')
    insumo = cursor.fetchone()
    cursor.close()
    conn.close()
    if insumo:
        return jsonify(insumo)
    else:
        return jsonify({'error': 'No hay datos de consumo de insumos'}), 404 