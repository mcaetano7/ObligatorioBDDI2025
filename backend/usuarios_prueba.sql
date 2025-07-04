USE CafesMarloy;

-- Insertar usuarios de prueba
-- Cliente de prueba
INSERT INTO Usuarios (nombre_usuario, email, password_hash, id_rol) 
VALUES ('Cliente Prueba', 'cliente@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2.', 1);

INSERT INTO Clientes (rut, nombre_empresa, direccion, telefono) 
VALUES (LAST_INSERT_ID(), 'Empresa de Prueba', 'Dirección de Prueba 123', '099123456');

-- Administrador de prueba
INSERT INTO Usuarios (nombre_usuario, email, password_hash, id_rol) 
VALUES ('Admin Prueba', 'admin@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2.', 2);

-- Nota: La contraseña para ambos usuarios es "password123" 