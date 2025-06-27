USE CafesMarloy;

-- Roles (para que existan antes de Usuarios)
INSERT INTO Roles (nombre_rol) VALUES
('Administrador'),
('Usuario');

-- Usuarios (con id_rol relacionado)
INSERT INTO Usuarios (nombre_usuario, email, password_hash, id_rol) VALUES
('Admin Marloy', 'admin@cafesmarloy.com', 'super_password', 1),
('Martina Caetano', 'martina@cafesmarloy.com', 'passmartina', 2);

-- Proveedores
INSERT INTO Proveedores (nombre_proveedor, telefono, email, direccion) VALUES
('Culto café', '', 'ventas@culto.com', ''),
('Conaprole', '', 'ventas@conaprole.com', ''),
('Azúcar Bella Unión', '', 'ventas@azucarbellaunion.com', ''),
('Insumos cafeteros', '', 'ventas@insumoscafeteros.com', '');

-- Clientes
-- IMPORTANTE: El campo rut es FK a Usuarios.id_usuario,
-- así que debemos usar los ids de Usuarios para relacionar.
-- Para este ejemplo, asumimos que ya tenemos Usuarios con id 1 y 2.
INSERT INTO Clientes (rut, nombre_empresa, direccion, telefono) VALUES
(1, 'Sanitaria MC', 'Rivera 2054', '24022944'),
(2, 'Universidad Católica del Uruguay', 'Av. 8 de Octubre 2738', '24872717');

-- Insumos
INSERT INTO Insumos (nombre_insumo, unidad_medida, costo_unitario, id_proveedor) VALUES
('Café instantáneo 1kg', 'Café', 720.00, 1),
('Café espresso granulado 1kg', 'Café', 950.00, 1),
('Leche en polvo 1kg', 'Lácteo', 680.00, 2),
('Azúcar refinada en polvo 1kg', 'Endulzante', 52.00, 3),
('Edulcorante en polvo 500g', 'Endulzante', 110.00, 3),
('Vasos plásticos 200ml x 100u', 'Accesorio', 230.00, 4),
('Tapas para vasos x 100u', 'Accesorio', 180.00, 4),
('Agitadores plásticos x 100u', 'Accesorio', 95.00, 4),
('Chocolate en polvo 1kg', 'Otros', 800.00, 4);

-- Maquinas
INSERT INTO Maquinas (modelo, marca, capacidad_cafe, capacidad_agua, costo_mensual_alquiler, porcentaje_ganancia_empresa) VALUES
('Saeco Aulika Top', 'Saeco', 1000.00, 2000.00, 2500.00, 20),
('Necta Krea Touch', 'Necta', 1200.00, 2500.00, 3200.00, 25),
('Saeco Lirika One Touch', 'Saeco', 900.00, 1800.00, 2800.00, 22),
('Necta Solista', 'Necta', 850.00, 1700.00, 2300.00, 18);

-- Alquileres (relacionan máquinas con clientes)
INSERT INTO Alquileres (id_maquina, id_cliente, fecha_inicio, fecha_fin, ganancias_maquina_total, coste_total_alquiler) VALUES
(1, 1, '2024-01-01', '2024-12-31', 0, 2500.00),
(2, 2, '2024-02-01', '2024-12-31', 0, 3200.00),
(3, 2, '2024-03-01', '2024-12-31', 0, 2800.00),
(4, 1, '2024-04-01', '2024-12-31', 0, 2300.00);

INSERT INTO Tecnicos (nombre_tecnico, telefono, email) VALUES
('Juan Pérez', '099123456', 'juan.perez@tecnicos.com'),
('María Gómez', '098654321', 'maria.gomez@tecnicos.com');

INSERT INTO SolicitudesMantenimiento (
    id_alquiler, fecha_solicitud, descripcion, id_tecnico_asignado, fecha_asignacion, fecha_resolucion
) VALUES
(1, '2024-06-15', 'Revisión general máquina', 1, '2024-06-16', '2024-06-18'),
(2, '2024-07-01', 'Cambio de filtro de agua', 2, '2024-07-02', NULL);

INSERT INTO GananciasMaquina (
    id_alquiler, mes, anio, ganancia_cliente, ganancia_empresa, total_ventas
) VALUES
(1, 5, 2024, 5000.00, 1000.00, 6000.00),
(2, 5, 2024, 7000.00, 1400.00, 8400.00);

INSERT INTO ConsumoInsumos (
    id_alquiler, id_insumo, cantidad_consumida, fecha_consumo
) VALUES
(1, 1, 10.50, '2024-06-10'),
(1, 4, 5.00, '2024-06-10'),
(2, 2, 8.00, '2024-06-15'),
(2, 5, 3.50, '2024-06-15');
