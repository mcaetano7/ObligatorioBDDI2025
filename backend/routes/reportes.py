from flask import Blueprint, jsonify, request
from db import get_connection

reportes_bp = Blueprint('reportes', __name__, url_prefix='/reportes')

@reportes_bp.route('/insumos-mayor-consumo', methods=['GET'])
def insumos_mayor_consumo():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            i.nombre_insumo,
            i.unidad_medida,
            SUM(ci.cantidad_consumida) as total_consumido,
            SUM(ci.cantidad_consumida * i.costo_unitario) as costo_total,
            COUNT(ci.id_consumo) as veces_consumido,
            p.nombre_proveedor
        FROM Insumos i
        LEFT JOIN ConsumoInsumos ci ON i.id_insumo = ci.id_insumo
        LEFT JOIN Proveedores p ON i.id_proveedor = p.id_proveedor
        GROUP BY i.id_insumo, i.nombre_insumo, i.unidad_medida, p.nombre_proveedor
        ORDER BY total_consumido DESC
        LIMIT 10
    """
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@reportes_bp.route('/tecnicos-mas-mantenimientos', methods=['GET'])
def tecnicos_mas_mantenimientos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            t.nombre_tecnico,
            t.email,
            t.telefono,
            COUNT(sm.id_solicitud) as total_mantenimientos,
            COUNT(CASE WHEN sm.fecha_resolucion IS NOT NULL THEN 1 END) as mantenimientos_completados,
            COUNT(CASE WHEN sm.fecha_resolucion IS NULL THEN 1 END) as mantenimientos_pendientes,
            ROUND(COUNT(CASE WHEN sm.fecha_resolucion IS NOT NULL THEN 1 END) * 100.0 / COUNT(sm.id_solicitud), 2) as porcentaje_completado
        FROM Tecnicos t
        LEFT JOIN SolicitudesMantenimiento sm ON t.id_tecnico = sm.id_tecnico_asignado
        GROUP BY t.id_tecnico, t.nombre_tecnico, t.email, t.telefono
        ORDER BY total_mantenimientos DESC
    """
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@reportes_bp.route('/clientes-mas-maquinas', methods=['GET'])
def clientes_mas_maquinas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            c.nombre_empresa,
            c.direccion,
            c.telefono,
            COUNT(DISTINCT a.id_maquina) as cantidad_maquinas,
            SUM(a.coste_total_alquiler) as total_gastado,
            COUNT(a.id_alquiler) as total_alquileres,
            MAX(a.fecha_inicio) as ultimo_alquiler
        FROM Clientes c
        LEFT JOIN Alquileres a ON c.id_cliente = a.id_cliente
        GROUP BY c.id_cliente, c.nombre_empresa, c.direccion, c.telefono
        ORDER BY cantidad_maquinas DESC, total_gastado DESC
    """
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@reportes_bp.route('/ganancias-empresa', methods=['GET'])
def ganancias_empresa():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            YEAR(gm.anio) as anio,
            gm.mes,
            SUM(gm.ganancia_empresa) as ganancia_total,
            SUM(gm.total_ventas) as ventas_total,
            COUNT(gm.id_ganancia) as cantidad_transacciones,
            ROUND(SUM(gm.ganancia_empresa) * 100.0 / SUM(gm.total_ventas), 2) as porcentaje_ganancia
        FROM GananciasMaquina gm
        GROUP BY gm.anio, gm.mes
        ORDER BY gm.anio DESC, gm.mes DESC
    """
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@reportes_bp.route('/maquinas-mas-rentables', methods=['GET'])
def maquinas_mas_rentables():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            m.modelo,
            m.marca,
            m.costo_mensual_alquiler,
            COUNT(a.id_alquiler) as veces_alquilada,
            SUM(a.coste_total_alquiler) as ingresos_totales,
            SUM(gm.ganancia_empresa) as ganancia_empresa,
            ROUND(SUM(gm.ganancia_empresa) / COUNT(a.id_alquiler), 2) as ganancia_promedio_por_alquiler
        FROM Maquinas m
        LEFT JOIN Alquileres a ON m.id_maquina = a.id_maquina
        LEFT JOIN GananciasMaquina gm ON a.id_alquiler = gm.id_alquiler
        GROUP BY m.id_maquina, m.modelo, m.marca, m.costo_mensual_alquiler
        ORDER BY ganancia_empresa DESC
    """
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(data)

@reportes_bp.route('/estado-mantenimientos', methods=['GET'])
def estado_mantenimientos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT 
            COUNT(*) as total_solicitudes,
            COUNT(CASE WHEN fecha_resolucion IS NOT NULL THEN 1 END) as completados,
            COUNT(CASE WHEN fecha_resolucion IS NULL AND id_tecnico_asignado IS NOT NULL THEN 1 END) as en_proceso,
            COUNT(CASE WHEN fecha_resolucion IS NULL AND id_tecnico_asignado IS NULL THEN 1 END) as pendientes,
            ROUND(COUNT(CASE WHEN fecha_resolucion IS NOT NULL THEN 1 END) * 100.0 / COUNT(*), 2) as porcentaje_completado
        FROM SolicitudesMantenimiento
    """
    cursor.execute(query)
    data = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(data)

@reportes_bp.route('/resumen-mensual', methods=['GET'])
def resumen_mensual():
    mes = request.args.get('mes', None)
    anio = request.args.get('anio', None)
    
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    if mes and anio:
        query = """
            SELECT 
                COUNT(DISTINCT a.id_alquiler) as total_alquileres,
                SUM(a.coste_total_alquiler) as ingresos_alquiler,
                SUM(gm.ganancia_empresa) as ganancia_empresa,
                SUM(gm.total_ventas) as ventas_totales,
                COUNT(DISTINCT a.id_cliente) as clientes_activos,
                COUNT(DISTINCT a.id_maquina) as maquinas_activas
            FROM Alquileres a
            LEFT JOIN GananciasMaquina gm ON a.id_alquiler = gm.id_alquiler
            WHERE MONTH(a.fecha_inicio) = %s AND YEAR(a.fecha_inicio) = %s
        """
        cursor.execute(query, (mes, anio))
    else:
        query = """
            SELECT 
                COUNT(DISTINCT a.id_alquiler) as total_alquileres,
                SUM(a.coste_total_alquiler) as ingresos_alquiler,
                SUM(gm.ganancia_empresa) as ganancia_empresa,
                SUM(gm.total_ventas) as ventas_totales,
                COUNT(DISTINCT a.id_cliente) as clientes_activos,
                COUNT(DISTINCT a.id_maquina) as maquinas_activas
            FROM Alquileres a
            LEFT JOIN GananciasMaquina gm ON a.id_alquiler = gm.id_alquiler
            WHERE a.fecha_inicio >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        """
        cursor.execute(query)
    
    data = cursor.fetchone()
    cursor.close()
    conn.close()
    return jsonify(data) 