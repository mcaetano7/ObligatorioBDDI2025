from flask import Blueprint, jsonify
from db import get_connection

clientes_bp = Blueprint('clientes', __name__, url_prefix='/clientes')

@clientes_bp.route('/', methods=['GET'])
def listar_clientes():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT c.id, c.nombre, COUNT(m.id) AS cantidad_maquinas
        FROM clientes c
        LEFT JOIN maquinas m ON c.id = m.id_cliente
        GROUP BY c.id, c.nombre;
    """

    cursor.execute("SELECT * FROM clientes")
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)