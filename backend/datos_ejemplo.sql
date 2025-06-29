-- Datos de ejemplo para probar la aplicación
USE CafesMarloy;

-- Insertar roles
INSERT INTO Roles (nombre_rol) VALUES 
('Administrador'),
('Cliente');

-- Insertar usuarios
INSERT INTO Usuarios (nombre_usuario, email, password_hash, id_rol) VALUES 
('Admin Marloy', 'admin@marloy.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2', 1),
('Cliente Test', 'cliente@test.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2', 2);

-- Insertar clientes
INSERT INTO Clientes (rut, nombre_empresa, direccion, telefono) VALUES 
(2, 'Café Central', 'Av. 18 de Julio 1234', '099123456'),
(3, 'Café Express', 'Bulevar Artigas 567', '098654321'),
(4, 'Café Premium', 'Ruta 8 Km 25', '097789012');

-- Insertar proveedores
INSERT INTO Proveedores (nombre_proveedor, telefono, email, direccion) VALUES 
('Culto Café', '099111111', 'ventas@culto.com', 'Montevideo'),
('Conaprole', '099222222', 'ventas@conaprole.com', 'Montevideo'),
('Café del Uruguay', '099333333', 'ventas@cafedeluruguay.com', 'Paysandú');

-- Insertar insumos
INSERT INTO Insumos (nombre_insumo, unidad_medida, costo_unitario, id_proveedor) VALUES 
('Café instantáneo 1kg', 'kg', 720.00, 1),
('Leche en polvo 1kg', 'kg', 680.00, 2),
('Azúcar refinada 1kg', 'kg', 45.00, 3),
('Café molido premium 500g', 'g', 450.00, 1),
('Crema en polvo 500g', 'g', 320.00, 2);

-- Insertar máquinas
INSERT INTO Maquinas (modelo, marca, capacidad_cafe, capacidad_agua, costo_mensual_alquiler, porcentaje_ganancia_empresa) VALUES 
('Express 2000', 'CaféMax', 2.5, 5.0, 15000.00, 15.0),
('Premium 3000', 'CaféPro', 3.0, 6.0, 20000.00, 20.0),
('Compact 1500', 'CaféMini', 1.5, 3.0, 12000.00, 12.0),
('Industrial 5000', 'CaféIndustrial', 5.0, 10.0, 30000.00, 25.0);

-- Insertar técnicos
INSERT INTO Tecnicos (nombre_tecnico, telefono, email) VALUES 
('Juan Pérez', '099123456', 'juan.perez@tecnicos.com'),
('María Gómez', '098654321', 'maria.gomez@tecnicos.com'),
('Carlos López', '097789012', 'carlos.lopez@tecnicos.com');

-- Insertar alquileres
INSERT INTO Alquileres (id_maquina, id_cliente, fecha_inicio, fecha_fin, ganancias_maquina_total, coste_total_alquiler) VALUES 
(1, 1, '2024-01-01', '2024-12-31', 50000.00, 180000.00),
(2, 2, '2024-02-01', '2024-11-30', 45000.00, 200000.00),
(3, 3, '2024-03-01', '2024-10-31', 30000.00, 96000.00),
(4, 1, '2025-01-01', '2025-12-31', 0.00, 0.00),
(1, 2, '2025-02-01', '2025-11-30', 0.00, 0.00);

-- Insertar ganancias de máquinas
INSERT INTO GananciasMaquina (id_alquiler, mes, anio, ganancia_cliente, ganancia_empresa, total_ventas) VALUES 
(1, 1, 2024, 15000.00, 3000.00, 18000.00),
(1, 2, 2024, 16000.00, 3200.00, 19200.00),
(2, 2, 2024, 18000.00, 3600.00, 21600.00),
(2, 3, 2024, 17000.00, 3400.00, 20400.00),
(3, 3, 2024, 12000.00, 2400.00, 14400.00);

-- Insertar consumo de insumos
INSERT INTO ConsumoInsumos (id_alquiler, id_insumo, cantidad_consumida, fecha_consumo) VALUES 
(1, 1, 2.5, '2024-01-15'),
(1, 2, 1.0, '2024-01-15'),
(1, 3, 0.5, '2024-01-15'),
(2, 1, 3.0, '2024-02-20'),
(2, 2, 1.5, '2024-02-20'),
(3, 4, 500.0, '2024-03-10'),
(3, 5, 250.0, '2024-03-10');

-- Insertar solicitudes de mantenimiento
INSERT INTO SolicitudesMantenimiento (id_alquiler, fecha_solicitud, descripcion, id_tecnico_asignado, fecha_asignacion, fecha_resolucion) VALUES 
(1, '2024-01-15', 'Revisión general y limpieza', 1, '2024-01-16', '2024-01-18'),
(2, '2024-02-20', 'Cambio de filtro de agua', 2, '2024-02-21', '2024-02-22'),
(3, '2024-03-10', 'Ajuste de presión', 3, '2024-03-11', NULL),
(1, '2024-04-01', 'Mantenimiento preventivo', 1, '2024-04-02', NULL);

-- Contraseñas de ejemplo (admin123 y cliente123)
-- Para generar nuevas contraseñas usar: python -c "import bcrypt; print(bcrypt.hashpw('tu_password'.encode('utf-8'), bcrypt.gensalt()))" 