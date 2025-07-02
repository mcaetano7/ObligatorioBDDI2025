import bcrypt

def hash_password(password):
    """
    Hashea una contraseña usando bcrypt con salt automático
    
    Args:
        password (str): Contraseña en texto plano
        
    Returns:
        str: Contraseña hasheada en formato string
    """
    # Convertir la contraseña a bytes
    password_bytes = password.encode('utf-8')
    
    # Generar salt y hashear la contraseña
    salt = bcrypt.gensalt(12)  # Factor de trabajo 12 (balance entre seguridad y rendimiento)
    hashed = bcrypt.hashpw(password_bytes, salt)
    
    # Retornar como string para almacenar en la base de datos
    return hashed.decode('utf-8')

def verify_password(password, hashed_password):
    """
    Verifica si una contraseña coincide con su hash
    
    Args:
        password (str): Contraseña en texto plano
        hashed_password (str): Contraseña hasheada almacenada
        
    Returns:
        bool: True si la contraseña coincide, False en caso contrario
    """
    # Convertir a bytes para la verificación
    password_bytes = password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    
    # Verificar la contraseña
    return bcrypt.checkpw(password_bytes, hashed_bytes)

# Ejemplo de uso (para testing)
if __name__ == "__main__":
    # Ejemplo de hasheo
    test_password = "mi_contraseña_segura"
    hashed = hash_password(test_password)
    print(f"Contraseña original: {test_password}")
    print(f"Contraseña hasheada: {hashed}")
    
    # Ejemplo de verificación
    is_valid = verify_password(test_password, hashed)
    print(f"Verificación exitosa: {is_valid}")
    
    # Ejemplo de verificación fallida
    is_invalid = verify_password("contraseña_incorrecta", hashed)
    print(f"Verificación fallida: {is_invalid}")