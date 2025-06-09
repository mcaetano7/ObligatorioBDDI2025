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
()