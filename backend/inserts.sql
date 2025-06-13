USE CafesMarloy;

INSERT INTO LOGIN VALUES(
'admin@cafesmarloy.com', 'super_password', TRUE),
('martina@cafesmarloy.com', 'passmartina', FALSE);


INSERT INTO proveedores (nombre, contacto) VALUES
('Culto café', 'ventas@culto.com'),
('Conaprole', 'ventas@conaprole.com'),
('Azúcar Bella Unión', 'ventas@azucarbellaunion.com'),
('Insumos cafeteros', 'ventas@insumoscafeteros.com');

INSERT INTO clientes (nombre, direccion, telefono, correo) VALUES
('Sanitaria MC', 'Rivera 2054', '24022944', 'sanitariamc.carlos@gmail.com'),
('Universidad Católica del Uruguay', 'Av. 8 de Octubre 2738', '24872717', 'servicios@ucu.edu.uy');

INSERT INTO insumos (descripcion, tipo, precioUnitario, idProveedor) VALUES
('Café instantáneo 1kg', 'Café', 720.00, 1),
('Café espresso granulado 1kg', 'Café', 950.00, 1),
('Leche en polvo 1kg', 'Lácteo', 680.00, 2),
('Azúcar refinada en polvo 1kg', 'Endulzante', 52.00, 3),
('Edulcorante en polvo 500g', 'Endulzante', 110.00, 3),
('Vasos plásticos 200ml x 100u', 'Accesorio', 230.00, 4),
('Tapas para vasos x 100u', 'Accesorio', 180.00, 4),
('Agitadores plásticos x 100u', 'Accesorio', 95.00, 4),
('Chocolate en polvo 1kg', 'Otros', 800.00, 4);

INSERT INTO Maquinas (modelo, idCliente, ubicacionCliente, costoAlquilerMensual) VALUES
('Saeco Aulika Top', 1, 'Rivera 2054 - Salón', 2500.00),
('Necta Krea Touch', 2, '8 de Octubre 2738 - Piso 3', 3200.00),
('Saeco Lirika One Touch', 2, '8 de Octubre 2738 - Biblioteca', 2800.00),
('Necta Solista', 1, 'Rivera 2054 - Depósito', 2300.00);
