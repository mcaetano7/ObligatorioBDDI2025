from flask import Blueprint, jsonify
from db import get_connection

maquinas_bp = Blueprint('maquinas', __name__, url_prefix='/maquinas')

@maquinas_bp.route('/', methods=['GET'])
def listar_maquinas():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM maquinas")
    resultados = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(resultados)