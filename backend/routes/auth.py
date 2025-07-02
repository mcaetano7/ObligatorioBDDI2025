from flask import Blueprint, request, jsonify
from db import get_connection
from hash import hash_password, verify_password

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Registrar nuevo usuario (Cliente)
@auth_bp.route('/registro/cliente', methods=['POST'])
def registrar_cliente():
    data = request.get_json()
    nombre_usuario = data.get('nombre_usuario')
    email = data.get('email')
    password = data.get('password')
    nombre_empresa = data.get('nombre_empresa')
    direccion = data.get('direccion')
    telefono = data.get('telefono')

    if not all([nombre_usuario, email, password, nombre_empresa, direccion, telefono]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Crear usuario
        password_hash = hash_password(password)
        cursor.execute(
            "INSERT INTO Usuarios (nombre_usuario, email, password_hash, id_rol) VALUES (%s, %s, %s, 1)",
            (nombre_usuario, email, password_hash)
        )
        
        # Obtener el ID del usuario creado
        id_usuario = cursor.lastrowid
        
        # Crear cliente
        cursor.execute(
            "INSERT INTO Clientes (rut, nombre_empresa, direccion, telefono) VALUES (%s, %s, %s, %s)",
            (id_usuario, nombre_empresa, direccion, telefono)
        )
        
        conn.commit()
        return jsonify({'mensaje': 'Cliente registrado correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Registrar nuevo administrador
@auth_bp.route('/registro/admin', methods=['POST'])
def registrar_admin():
    data = request.get_json()
    nombre_usuario = data.get('nombre_usuario')
    email = data.get('email')
    password = data.get('password')

    if not all([nombre_usuario, email, password]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        password_hash = hash_password(password)
        cursor.execute(
            "INSERT INTO Usuarios (nombre_usuario, email, password_hash, id_rol) VALUES (%s, %s, %s, 2)",
            (nombre_usuario, email, password_hash)
        )
        conn.commit()
        return jsonify({'mensaje': 'Administrador registrado correctamente'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Login de usuario
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT u.*, r.nombre_rol 
            FROM Usuarios u 
            JOIN Roles r ON u.id_rol = r.id_rol 
            WHERE u.email = %s
        """, (email,))
        usuario = cursor.fetchone()
        
        if usuario and verify_password(password, usuario['password_hash']):
            # Si es cliente, obtener información adicional
            if usuario['id_rol'] == 1:  # Cliente
                cursor.execute("SELECT * FROM Clientes WHERE rut = %s", (usuario['id_usuario'],))
                cliente = cursor.fetchone()
                if cliente:
                    usuario['cliente_info'] = cliente
            
            # Remover password_hash por seguridad
            del usuario['password_hash']
            return jsonify(usuario)
        else:
            return jsonify({'error': 'Credenciales inválidas'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Obtener roles disponibles
@auth_bp.route('/roles', methods=['GET'])
def obtener_roles():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Roles")
    roles = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(roles)

# Obtener usuario por ID
@auth_bp.route('/usuario/<int:id_usuario>', methods=['GET'])
def obtener_usuario(id_usuario):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.*, r.nombre_rol 
        FROM Usuarios u 
        JOIN Roles r ON u.id_rol = r.id_rol 
        WHERE u.id_usuario = %s
    """, (id_usuario,))
    usuario = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if usuario:
        # Remover password_hash por seguridad
        del usuario['password_hash']
        return jsonify(usuario)
    else:
        return jsonify({'error': 'Usuario no encontrado'}), 404

# Actualizar usuario
@auth_bp.route('/usuario/<int:id_usuario>', methods=['PUT'])
def actualizar_usuario(id_usuario):
    data = request.get_json()
    nombre_usuario = data.get('nombre_usuario')
    email = data.get('email')
    password = data.get('password')  # Opcional

    if not all([nombre_usuario, email]):
        return jsonify({'error': 'Faltan datos requeridos'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        if password:
            password_hash = hash_password(password)
            cursor.execute("""
                UPDATE Usuarios 
                SET nombre_usuario = %s, email = %s, password_hash = %s 
                WHERE id_usuario = %s
            """, (nombre_usuario, email, password_hash, id_usuario))
        else:
            cursor.execute("""
                UPDATE Usuarios 
                SET nombre_usuario = %s, email = %s 
                WHERE id_usuario = %s
            """, (nombre_usuario, email, id_usuario))
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'Usuario no encontrado'}), 404
            
        conn.commit()
        return jsonify({'mensaje': 'Usuario actualizado correctamente'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        cursor.close()
        conn.close()

# Eliminar usuario
@auth_bp.route('/usuario/<int:id_usuario>', methods=['DELETE'])
def eliminar_usuario(id_usuario):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Usuarios WHERE id_usuario = %s", (id_usuario,))
        if cursor.rowcount == 0:
            return jsonify({'error': 'Usuario no encontrado'}), 404
        conn.commit()
        return jsonify({'mensaje': 'Usuario eliminado correctamente'})
    except Exception as e:
        conn.rollback()
        error_msg = str(e)
        if 'foreign key constraint' in error_msg.lower():
            return jsonify({'error': 'No se puede eliminar un usuario que tiene registros asociados'}), 400
        return jsonify({'error': error_msg}), 400
    finally:
        cursor.close()
        conn.close() 