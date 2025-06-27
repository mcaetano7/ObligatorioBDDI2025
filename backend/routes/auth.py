from flask import Blueprint, request, jsonify
from db import get_connection
import bcrypt

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    nombre = data.get('nombre_usuario')
    email = data.get('email')
    password = data.get('password')
    id_rol = data.get('id_rol')

    if not all([nombre, email, password, id_rol]):
        return jsonify({'error': 'Faltan campos'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # Verificar si ya existe el email
    cursor.execute("SELECT * FROM Usuarios WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({'error': 'El email ya está registrado'}), 400

    # Hash de la contraseña
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Insertar nuevo usuario
    query = """
        INSERT INTO Usuarios (nombre_usuario, email, password_hash, id_rol)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query, (nombre, email, password_hash, id_rol))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'mensaje': 'Usuario registrado correctamente'}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Email y contraseña son requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM Usuarios WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
        return jsonify({'mensaje': 'Login exitoso', 'usuario': {
            'id_usuario': user['id_usuario'],
            'nombre': user['nombre_usuario'],
            'email': user['email'],
            'id_rol': user['id_rol']
        }})
    else:
        return jsonify({'error': 'Credenciales incorrectas'}), 401
