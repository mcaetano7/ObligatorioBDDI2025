CREATE DATABASE IF NOT EXISTS CafesMarloy;
USE CafesMarloy;

CREATE TABLE Login (
    correo VARCHAR(255) PRIMARY KEY,
    contraseña VARCHAR(255) NOT NULL,
    esAdmin BOOLEAN NOT NULL
);

CREATE TABLE Proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contacto VARCHAR(255) 
);

CREATE TABLE Clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    precioUnitario DECIMAL(10,2) NOT NULL,
    idProveedor INT,
    FOREIGN KEY (idProveedor) REFERENCES Proveedores(id)
);

CREATE TABLE Maquinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(255) NOT NULL,
    idCliente INT,
    ubicacionCliente VARCHAR(255) NOT NULL,
    costoAlquilerMensual DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES Clientes(id)
);

CREATE TABLE Tecnicos (
    ci VARCHAR(20) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL
);

CREATE TABLE RegistroConsumo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idMaquina INT NOT NULL,
    idInsumo INT NOT NULL,
    fecha DATETIME NOT NULL,
    cantidadUsada INT NOT NULL,
    FOREIGN KEY (idMaquina) REFERENCES Maquinas(id),
    FOREIGN KEY (idInsumo) REFERENCES Insumos(id)
);

CREATE TABLE Mantenimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idMaquina INT NOT NULL,
    ciTecnico VARCHAR(20) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    fecha DATETIME NOT NULL,
    FOREIGN KEY (idMaquina) REFERENCES Maquinas(id),
    FOREIGN KEY (ciTecnico) REFERENCES Tecnicos(ci)
);

CREATE USER 'admin_marloy'@'localhost' IDENTIFIED BY 'super_password';
GRANT ALL PRIVILEGES ON CafesMarloy.* TO 'admin_marloy'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;


-- Renombramos y modificacamos tablas y columnas


USE CafesMarloy;


RENAME TABLE Login TO Usuarios;

ALTER TABLE Usuarios
    CHANGE COLUMN correo email VARCHAR(100) NOT NULL UNIQUE,
    CHANGE COLUMN contraseña password_hash VARCHAR(255) NOT NULL,
    ADD COLUMN id_usuario INT AUTO_INCREMENT PRIMARY KEY FIRST,
    ADD COLUMN nombre_usuario VARCHAR(100) AFTER id_usuario,
    ADD COLUMN id_rol INT AFTER password_hash,
    ADD COLUMN fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP AFTER id_rol;


CREATE TABLE IF NOT EXISTS Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE
);


ALTER TABLE Usuarios
    ADD CONSTRAINT fk_usuarios_roles FOREIGN KEY (id_rol) REFERENCES Roles(id_rol);


ALTER TABLE Clientes
    CHANGE COLUMN id id_cliente INT AUTO_INCREMENT,
    CHANGE COLUMN nombre nombre_empresa VARCHAR(150),
    CHANGE COLUMN correo rut INT UNIQUE, 
    MODIFY COLUMN direccion VARCHAR(255),
    MODIFY COLUMN telefono VARCHAR(50);


ALTER TABLE Clientes
    ADD CONSTRAINT fk_clientes_usuarios FOREIGN KEY (rut) REFERENCES Usuarios(id_usuario);


ALTER TABLE Maquinas
    CHANGE COLUMN id id_maquina INT AUTO_INCREMENT,
    CHANGE COLUMN modelo modelo VARCHAR(100),
    CHANGE COLUMN ubicacionCliente marca VARCHAR(100),
    ADD COLUMN capacidad_cafe DECIMAL(10,2),
    ADD COLUMN capacidad_agua DECIMAL(10,2),
    ADD COLUMN porcentaje_ganancia_empresa DECIMAL(5),
    CHANGE COLUMN costoAlquilerMensual costo_mensual_alquiler DECIMAL(10,2),
    DROP FOREIGN KEY Maquinas_ibfk_1,
    CHANGE COLUMN idCliente id_cliente INT,
    ADD CONSTRAINT fk_maquinas_clientes FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente);


CREATE TABLE IF NOT EXISTS Alquileres (
    id_alquiler INT AUTO_INCREMENT PRIMARY KEY,
    id_maquina INT,
    id_cliente INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    ganancias_maquina_total DECIMAL(12,2) DEFAULT 0,
    coste_total_alquiler DECIMAL(12,2) DEFAULT 0,
    FOREIGN KEY (id_maquina) REFERENCES Maquinas(id_maquina),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
);


CREATE TABLE IF NOT EXISTS GananciasMaquina (
    id_ganancia INT AUTO_INCREMENT PRIMARY KEY,
    id_alquiler INT,
    mes INT,
    año INT,
    ganancia_cliente DECIMAL(10,2),
    ganancia_empresa DECIMAL(10,2),
    total_ventas DECIMAL(12),
    FOREIGN KEY (id_alquiler) REFERENCES Alquileres(id_alquiler)
);


ALTER TABLE Insumos
    CHANGE COLUMN id id_insumo INT AUTO_INCREMENT,
    CHANGE COLUMN descripcion nombre_insumo VARCHAR(100),
    CHANGE COLUMN tipo unidad_medida VARCHAR(50),
    CHANGE COLUMN precioUnitario costo_unitario DECIMAL(10,2),
    ADD CONSTRAINT fk_insumos_proveedores FOREIGN KEY (idProveedor) REFERENCES Proveedores(id);


RENAME TABLE RegistroConsumo TO ConsumoInsumos;

ALTER TABLE ConsumoInsumos
    CHANGE COLUMN id id_consumo INT AUTO_INCREMENT,
    CHANGE COLUMN idMaquina id_alquiler INT,  
    CHANGE COLUMN idInsumo id_insumo INT,
    CHANGE COLUMN fecha fecha_consumo DATE,
    CHANGE COLUMN cantidadUsada cantidad_consumida DECIMAL(10,2),
    DROP FOREIGN KEY RegistroConsumo_ibfk_1,
    DROP FOREIGN KEY RegistroConsumo_ibfk_2,
    ADD FOREIGN KEY (id_alquiler) REFERENCES Alquileres(id_alquiler),
    ADD FOREIGN KEY (id_insumo) REFERENCES Insumos(id_insumo);


ALTER TABLE Tecnicos
    CHANGE COLUMN ci id_tecnico INT AUTO_INCREMENT PRIMARY KEY,
    CHANGE COLUMN nombre nombre_tecnico VARCHAR(100),
    DROP COLUMN apellido;


RENAME TABLE Mantenimientos TO SolicitudesMantenimiento;

ALTER TABLE SolicitudesMantenimiento
    CHANGE COLUMN id id_solicitud INT AUTO_INCREMENT,
    CHANGE COLUMN idMaquina id_alquiler INT,
    CHANGE COLUMN ciTecnico id_tecnico_asignado INT,
    CHANGE COLUMN tipo descripcion TEXT,
    CHANGE COLUMN fecha fecha_solicitud DATE,
    ADD COLUMN fecha_asignacion DATE,
    ADD COLUMN fecha_resolucion DATE,
    DROP FOREIGN KEY Mantenimientos_ibfk_1,
    DROP FOREIGN KEY Mantenimientos_ibfk_2,
    ADD FOREIGN KEY (id_alquiler) REFERENCES Alquileres(id_alquiler),
    ADD FOREIGN KEY (id_tecnico_asignado) REFERENCES Tecnicos(id_tecnico);

