import bcrypt


password = "my_secure_password"
password_hash = password.encode()

salt = bcrypt.gensalt(15)

hashed_password = bcrypt.hashpw(password_hash, salt)