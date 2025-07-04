USE CafesMarloy;

-- Roles
INSERT INTO Roles (nombre_rol) VALUES
('Cliente'),
('Administrador');

-- Proveedores
INSERT INTO Proveedores (nombre_proveedor, telefono, email, direccion) VALUES
('Culto café', '099111111', 'ventas@culto.com', 'Calle 1'),
('Conaprole', '099222222', 'ventas@conaprole.com', 'Calle 2'),
('Azúcar Bella Unión', '099333333', 'ventas@azucarbellaunion.com', 'Calle 3');

-- Insumos
INSERT INTO Insumos (nombre_insumo, unidad_medida, costo_unitario, id_proveedor) VALUES
('Café instantáneo 1kg', 'Café', 720.00, 1),
('Café espresso granulado 1kg', 'Café', 950.00, 1),
('Leche en polvo 1kg', 'Lácteo', 680.00, 2),
('Azúcar refinada en polvo 1kg', 'Endulzante', 52.00, 3),
('Edulcorante en polvo 500g', 'Endulzante', 110.00, 3);

-- Maquinas
INSERT INTO Maquinas (modelo, marca, capacidad_cafe, capacidad_agua, costo_mensual_alquiler, porcentaje_ganancia_empresa, estado) VALUES
('Saeco Aulika Top', 'Saeco', 1000.00, 2000.00, 2500.00, 20, FALSE),
('Necta Krea Touch', 'Necta', 1200.00, 2500.00, 3200.00, 25, FALSE),
('Saeco Lirika One Touch', 'Saeco', 900.00, 1800.00, 2800.00, 22, FALSE),
('Necta Solista', 'Necta', 850.00, 1700.00, 2300.00, 18, FALSE),
('Saeco Royal', 'Saeco', 1100.00, 2100.00, 2600.00, 21, FALSE),
('Necta Brio Up', 'Necta', 950.00, 1900.00, 2400.00, 19, FALSE);

-- Técnicos
INSERT INTO Tecnicos (nombre_tecnico, telefono, email) VALUES
('Juan Pérez', '099123456', 'juan.perez@tecnicos.com'),
('María Gómez', '098654321', 'maria.gomez@tecnicos.com'),
('Carlos López', '097987654', 'carlos.lopez@tecnicos.com');

-- Cafés disponibles
INSERT INTO Cafes (nombre_cafe, precio_venta, descripcion) VALUES
('Espresso', 120.00, 'Café concentrado servido en taza pequeña'),
('Cappuccino', 180.00, 'Espresso con leche espumada y espolvoreado de cacao'),
('Latte', 200.00, 'Espresso con leche caliente y poca espuma'),
('Americano', 150.00, 'Espresso diluido con agua caliente'),
('Mocha', 220.00, 'Espresso con chocolate y leche'),
('Macchiato', 160.00, 'Espresso con una pequeña cantidad de leche espumada');

-- Asignación de cafés a máquinas
-- Saeco Aulika Top (id_maquina = 1)
INSERT INTO MaquinaCafes (id_maquina, id_cafe) VALUES
(1, 1), -- Espresso
(1, 2), -- Cappuccino
(1, 3), -- Latte
(1, 4); -- Americano

-- Necta Krea Touch (id_maquina = 2)
INSERT INTO MaquinaCafes (id_maquina, id_cafe) VALUES
(2, 1), -- Espresso
(2, 2), -- Cappuccino
(2, 3), -- Latte
(2, 5); -- Mocha

-- Saeco Lirika One Touch (id_maquina = 3)
INSERT INTO MaquinaCafes (id_maquina, id_cafe) VALUES
(3, 1), -- Espresso
(3, 4), -- Americano
(3, 6); -- Macchiato

-- Necta Solista (id_maquina = 4)
INSERT INTO MaquinaCafes (id_maquina, id_cafe) VALUES
(4, 1), -- Espresso
(4, 2), -- Cappuccino
(4, 3), -- Latte
(4, 5); -- Mocha

-- Saeco Royal (id_maquina = 5)
INSERT INTO MaquinaCafes (id_maquina, id_cafe) VALUES
(5, 1), -- Espresso
(5, 2), -- Cappuccino
(5, 3), -- Latte
(5, 4); -- Americano

-- Necta Brio Up (id_maquina = 6)
INSERT INTO MaquinaCafes (id_maquina, id_cafe) VALUES
(6, 1), -- Espresso
(6, 2), -- Cappuccino
(6, 3), -- Latte
(6, 5); -- Mocha

-- Insumos requeridos por cada café
-- Espresso (id_cafe = 1)
INSERT INTO CafeInsumos (id_cafe, id_insumo, cantidad_por_servicio) VALUES
(1, 2, 0.018), -- 18g de café espresso granulado
(1, 4, 0.005); -- 5g de azúcar (opcional)

-- Cappuccino (id_cafe = 2)
INSERT INTO CafeInsumos (id_cafe, id_insumo, cantidad_por_servicio) VALUES
(2, 2, 0.018), -- 18g de café espresso granulado
(2, 3, 0.120), -- 120g de leche en polvo
(2, 4, 0.010); -- 10g de azúcar

-- Latte (id_cafe = 3)
INSERT INTO CafeInsumos (id_cafe, id_insumo, cantidad_por_servicio) VALUES
(3, 2, 0.018), -- 18g de café espresso granulado
(3, 3, 0.150), -- 150g de leche en polvo
(3, 4, 0.008); -- 8g de azúcar

-- Americano (id_cafe = 4)
INSERT INTO CafeInsumos (id_cafe, id_insumo, cantidad_por_servicio) VALUES
(4, 2, 0.018), -- 18g de café espresso granulado
(4, 4, 0.005); -- 5g de azúcar (opcional)

-- Mocha (id_cafe = 5)
INSERT INTO CafeInsumos (id_cafe, id_insumo, cantidad_por_servicio) VALUES
(5, 2, 0.018), -- 18g de café espresso granulado
(5, 3, 0.120), -- 120g de leche en polvo
(5, 4, 0.015); -- 15g de azúcar (más dulce)

-- Macchiato (id_cafe = 6)
INSERT INTO CafeInsumos (id_cafe, id_insumo, cantidad_por_servicio) VALUES
(6, 2, 0.018), -- 18g de café espresso granulado
(6, 3, 0.030); -- 30g de leche en polvo (poca cantidad)

-- Ventas de ejemplo (asumiendo que hay alquileres activos)
-- Nota: Estas ventas solo se insertarán si existen alquileres en la tabla Alquileres
-- Ventas del mes actual para diferentes cafés
INSERT INTO Ventas (id_alquiler, id_cafe, cantidad, precio_unitario, fecha_venta) VALUES
(1, 1, 45, 120.00, '2025-07-01 08:30:00'),
(1, 2, 32, 180.00, '2025-07-01 09:15:00'),
(1, 3, 28, 200.00, '2025-07-01 10:00:00'),
(1, 1, 38, 120.00, '2025-07-01 11:30:00'),
(1, 2, 25, 180.00, '2025-07-01 12:45:00'),
(1, 4, 15, 150.00, '2025-07-01 14:20:00'),
(1, 1, 42, 120.00, '2025-07-01 16:00:00'),
(1, 3, 20, 200.00, '2025-07-01 17:30:00');
