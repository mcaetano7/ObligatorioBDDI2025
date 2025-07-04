-- =====================================================
-- CONSULTAS SQL PARA SISTEMA DE GESTIÓN DE CAFÉS MARLOY
-- =====================================================

-- =====================================================
-- PROVEEDORES
-- =====================================================

-- Agregar proveedor
INSERT INTO Proveedores (nombre_proveedor, telefono, email, direccion) 
VALUES ('Nuevo Proveedor', '099999999', 'nuevo@proveedor.com', 'Nueva Dirección');

-- Modificar proveedor
UPDATE Proveedores 
SET nombre_proveedor = 'Proveedor Modificado', 
    telefono = '098888888', 
    email = 'modificado@proveedor.com', 
    direccion = 'Dirección Modificada' 
WHERE id_proveedor = 1;

-- Eliminar proveedor
DELETE FROM Proveedores WHERE id_proveedor = 1;

-- Traer todos los proveedores
SELECT * FROM Proveedores;

-- =====================================================
-- INSUMOS
-- =====================================================

-- Agregar insumo
INSERT INTO Insumos (nombre_insumo, unidad_medida, costo_unitario, id_proveedor) 
VALUES ('Nuevo Insumo', 'Unidad', 100.00, 1);

-- Modificar insumo
UPDATE Insumos 
SET nombre_insumo = 'Insumo Modificado', 
    unidad_medida = 'Nueva Unidad', 
    costo_unitario = 150.00, 
    id_proveedor = 2 
WHERE id_insumo = 1;

-- Eliminar insumo
DELETE FROM Insumos WHERE id_insumo = 1;

-- Traer todos los insumos
SELECT i.*, p.nombre_proveedor 
FROM Insumos i 
JOIN Proveedores p ON i.id_proveedor = p.id_proveedor;

-- =====================================================
-- CLIENTES
-- =====================================================

-- Agregar cliente
INSERT INTO Usuarios (nombre_usuario, email, password_hash, id_rol) 
VALUES ('Nuevo Cliente', 'nuevo@cliente.com', 'hash_password', 1);

INSERT INTO Clientes (rut, nombre_empresa, direccion, telefono) 
VALUES (LAST_INSERT_ID(), 'Nueva Empresa', 'Nueva Dirección', '099999999');

-- Modificar cliente
UPDATE Usuarios 
SET nombre_usuario = 'Cliente Modificado', 
    email = 'modificado@cliente.com' 
WHERE id_usuario = (SELECT rut FROM Clientes WHERE id_cliente = 1);

UPDATE Clientes 
SET nombre_empresa = 'Empresa Modificada', 
    direccion = 'Dirección Modificada', 
    telefono = '098888888' 
WHERE id_cliente = 1;

-- Eliminar cliente
DELETE FROM Clientes WHERE id_cliente = 1;
DELETE FROM Usuarios WHERE id_usuario = (SELECT rut FROM Clientes WHERE id_cliente = 1);

-- Traer todos los clientes
SELECT c.*, u.nombre_usuario, u.email 
FROM Clientes c 
JOIN Usuarios u ON c.rut = u.id_usuario;

-- =====================================================
-- MÁQUINAS
-- =====================================================

-- Agregar máquina
INSERT INTO Maquinas (modelo, marca, capacidad_cafe, capacidad_agua, costo_mensual_alquiler, porcentaje_ganancia_empresa, estado) 
VALUES ('Nuevo Modelo', 'Nueva Marca', 1000.00, 2000.00, 3000.00, 25, FALSE);

-- Modificar máquina
UPDATE Maquinas 
SET modelo = 'Modelo Modificado', 
    marca = 'Marca Modificada', 
    capacidad_cafe = 1100.00, 
    capacidad_agua = 2200.00, 
    costo_mensual_alquiler = 3500.00, 
    porcentaje_ganancia_empresa = 30, 
    estado = TRUE 
WHERE id_maquina = 1;

-- Eliminar máquina
DELETE FROM Maquinas WHERE id_maquina = 1;

-- Traer todas las máquinas
SELECT * FROM Maquinas;

-- Traer todas las máquinas alquiladas
SELECT * FROM Maquinas WHERE estado = TRUE;

-- Traer todas las máquinas no alquiladas
SELECT * FROM Maquinas WHERE estado = FALSE;

-- Traer todas las máquinas alquiladas por un cliente
SELECT m.*, c.nombre_empresa, a.fecha_inicio, a.fecha_fin 
FROM Maquinas m 
JOIN Alquileres a ON m.id_maquina = a.id_maquina 
JOIN Clientes c ON a.id_cliente = c.id_cliente 
WHERE c.id_cliente = 1 AND m.estado = TRUE;

-- =====================================================
-- TÉCNICOS
-- =====================================================

-- Agregar técnico
INSERT INTO Tecnicos (nombre_tecnico, telefono, email) 
VALUES ('Nuevo Técnico', '099999999', 'nuevo@tecnico.com');

-- Modificar técnico
UPDATE Tecnicos 
SET nombre_tecnico = 'Técnico Modificado', 
    telefono = '098888888', 
    email = 'modificado@tecnico.com' 
WHERE id_tecnico = 1;

-- Eliminar técnico
DELETE FROM Tecnicos WHERE id_tecnico = 1;

-- Traer todos los técnicos
SELECT * FROM Tecnicos;

-- Traer todos los técnicos que no estén asignados a un mantenimiento
SELECT t.* 
FROM Tecnicos t 
WHERE t.id_tecnico NOT IN (
    SELECT DISTINCT id_tecnico_asignado 
    FROM SolicitudesMantenimiento 
    WHERE id_tecnico_asignado IS NOT NULL
);

-- =====================================================
-- SOLICITUDES DE MANTENIMIENTO
-- =====================================================

-- Agregar solicitud de mantenimiento
INSERT INTO SolicitudesMantenimiento (id_alquiler, fecha_solicitud, descripcion, id_tecnico_asignado, fecha_asignacion) 
VALUES (1, CURDATE(), 'Nueva solicitud de mantenimiento', 1, CURDATE());

-- Modificar solicitud de mantenimiento
UPDATE SolicitudesMantenimiento 
SET descripcion = 'Descripción modificada', 
    id_tecnico_asignado = 2, 
    fecha_asignacion = CURDATE() 
WHERE id_solicitud = 1;

-- Marcar solicitud como completada
UPDATE SolicitudesMantenimiento 
SET fecha_resolucion = CURDATE() 
WHERE id_solicitud = 1;

-- Eliminar solicitud de mantenimiento
DELETE FROM SolicitudesMantenimiento WHERE id_solicitud = 1;

-- Traer todas las solicitudes de mantenimiento
SELECT sm.*, c.nombre_empresa, t.nombre_tecnico, m.modelo, m.marca 
FROM SolicitudesMantenimiento sm 
JOIN Alquileres a ON sm.id_alquiler = a.id_alquiler 
JOIN Clientes c ON a.id_cliente = c.id_cliente 
JOIN Maquinas m ON a.id_maquina = m.id_maquina 
LEFT JOIN Tecnicos t ON sm.id_tecnico_asignado = t.id_tecnico;

-- Traer todas las solicitudes de mantenimiento que no estén completas
SELECT sm.*, c.nombre_empresa, t.nombre_tecnico, m.modelo, m.marca 
FROM SolicitudesMantenimiento sm 
JOIN Alquileres a ON sm.id_alquiler = a.id_alquiler 
JOIN Clientes c ON a.id_cliente = c.id_cliente 
JOIN Maquinas m ON a.id_maquina = m.id_maquina 
LEFT JOIN Tecnicos t ON sm.id_tecnico_asignado = t.id_tecnico 
WHERE sm.fecha_resolucion IS NULL;

-- =====================================================
-- CAFÉS
-- =====================================================

-- Agregar café
INSERT INTO Cafes (nombre_cafe, precio_venta, descripcion) 
VALUES ('Nuevo Café', 250.00, 'Descripción del nuevo café');

-- Modificar café
UPDATE Cafes 
SET nombre_cafe = 'Café Modificado', 
    precio_venta = 300.00, 
    descripcion = 'Descripción modificada' 
WHERE id_cafe = 1;

-- Eliminar café
DELETE FROM Cafes WHERE id_cafe = 1;

-- Traer todos los cafés
SELECT * FROM Cafes;

-- =====================================================
-- TIPOS DE CAFÉS POR MÁQUINA
-- =====================================================

-- Agregar tipo de café a una máquina
INSERT INTO MaquinaCafes (id_maquina, id_cafe) 
VALUES (1, 1);

-- Modificar tipo de café de una máquina (eliminar y agregar nuevo)
DELETE FROM MaquinaCafes WHERE id_maquina = 1 AND id_cafe = 1;
INSERT INTO MaquinaCafes (id_maquina, id_cafe) VALUES (1, 2);

-- Eliminar tipo de café de una máquina
DELETE FROM MaquinaCafes WHERE id_maquina = 1 AND id_cafe = 1;

-- Traer todos los tipos de café de una máquina
SELECT c.*, mc.id_maquina 
FROM Cafes c 
JOIN MaquinaCafes mc ON c.id_cafe = mc.id_cafe 
WHERE mc.id_maquina = 1;

-- =====================================================
-- AUTENTICACIÓN Y REGISTRO
-- =====================================================

-- Registrar nuevo usuario (Cliente)
INSERT INTO Usuarios (nombre_usuario, email, password_hash, id_rol) 
VALUES ('Nuevo Usuario', 'nuevo@usuario.com', 'hash_password', 1);

-- Registrar nuevo administrador
INSERT INTO Usuarios (nombre_usuario, email, password_hash, id_rol) 
VALUES ('Nuevo Admin', 'admin@marloy.com', 'hash_password', 2);

-- Login de usuario (verificar credenciales)
SELECT u.*, r.nombre_rol 
FROM Usuarios u 
JOIN Roles r ON u.id_rol = r.id_rol 
WHERE u.email = 'usuario@ejemplo.com' AND u.password_hash = 'hash_password';

-- =====================================================
-- CONSULTAS ADICIONALES ÚTILES
-- =====================================================

-- Traer máquinas con sus cafés disponibles
SELECT m.*, GROUP_CONCAT(c.nombre_cafe) as cafes_disponibles 
FROM Maquinas m 
LEFT JOIN MaquinaCafes mc ON m.id_maquina = mc.id_maquina 
LEFT JOIN Cafes c ON mc.id_cafe = c.id_cafe 
GROUP BY m.id_maquina;

-- Traer alquileres activos con información completa
SELECT a.*, c.nombre_empresa, m.modelo, m.marca 
FROM Alquileres a 
JOIN Clientes c ON a.id_cliente = c.id_cliente 
JOIN Maquinas m ON a.id_maquina = m.id_maquina 
WHERE a.fecha_fin >= CURDATE();

-- Traer ventas por período
SELECT v.*, c.nombre_cafe, a.id_cliente 
FROM Ventas v 
JOIN Cafes c ON v.id_cafe = c.id_cafe 
JOIN Alquileres a ON v.id_alquiler = a.id_alquiler 
WHERE v.fecha_venta BETWEEN '2025-01-01' AND '2025-12-31';

-- Traer consumo de insumos por período
SELECT ci.*, i.nombre_insumo, a.id_cliente 
FROM ConsumoInsumos ci 
JOIN Insumos i ON ci.id_insumo = i.id_insumo 
JOIN Alquileres a ON ci.id_alquiler = a.id_alquiler 
WHERE ci.fecha_consumo BETWEEN '2025-01-01' AND '2025-12-31'; 