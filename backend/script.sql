DROP DATABASE IF EXISTS CafesMarloy;
CREATE DATABASE CafesMarloy;
USE CafesMarloy;


CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE
);


CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol)
);


CREATE TABLE Clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    rut INT UNIQUE,
    nombre_empresa VARCHAR(150),
    direccion VARCHAR(255),
    telefono VARCHAR(50),
    FOREIGN KEY (rut) REFERENCES Usuarios(id_usuario)
);


CREATE TABLE Proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_proveedor VARCHAR(150),
    telefono VARCHAR(50),
    email VARCHAR(100),
    direccion VARCHAR(255)
);


CREATE TABLE Insumos (
    id_insumo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_insumo VARCHAR(100),
    unidad_medida VARCHAR(50),
    costo_unitario DECIMAL(10,2),
    id_proveedor INT,
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);


CREATE TABLE Maquinas (
    id_maquina INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(100),
    marca VARCHAR(100),
    capacidad_cafe DECIMAL(10,2),
    capacidad_agua DECIMAL(10,2),
    costo_mensual_alquiler DECIMAL(10,2),
    porcentaje_ganancia_empresa DECIMAL(5),
    estado BOOLEAN DEFAULT FALSE
);


CREATE TABLE Cafes (
    id_cafe INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cafe VARCHAR(100),
    precio_venta DECIMAL(10,2),
    descripcion TEXT
);


CREATE TABLE MaquinaCafes (
    id_maquina INT,
    id_cafe INT,
    PRIMARY KEY (id_maquina, id_cafe),
    FOREIGN KEY (id_maquina) REFERENCES Maquinas(id_maquina),
    FOREIGN KEY (id_cafe) REFERENCES Cafes(id_cafe)
);


CREATE TABLE CafeInsumos (
    id_cafe INT,
    id_insumo INT,
    cantidad_por_servicio DECIMAL(10,2),
    PRIMARY KEY (id_cafe, id_insumo),
    FOREIGN KEY (id_cafe) REFERENCES Cafes(id_cafe),
    FOREIGN KEY (id_insumo) REFERENCES Insumos(id_insumo)
);


CREATE TABLE Alquileres (
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


CREATE TABLE Ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_alquiler INT,
    id_cafe INT,
    cantidad INT,
    precio_unitario DECIMAL(10,2),
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_alquiler) REFERENCES Alquileres(id_alquiler),
    FOREIGN KEY (id_cafe) REFERENCES Cafes(id_cafe)
);

CREATE TABLE GananciasMaquina (
    id_ganancia INT AUTO_INCREMENT PRIMARY KEY,
    id_alquiler INT,
    mes INT,
    anio INT,
    ganancia_cliente DECIMAL(10,2),
    ganancia_empresa DECIMAL(10,2),
    total_ventas DECIMAL(12),
    FOREIGN KEY (id_alquiler) REFERENCES Alquileres(id_alquiler)
);


CREATE TABLE ConsumoInsumos (
    id_consumo INT AUTO_INCREMENT PRIMARY KEY,
    id_alquiler INT,
    id_insumo INT,
    cantidad_consumida DECIMAL(10,2),
    fecha_consumo DATE,
    FOREIGN KEY (id_alquiler) REFERENCES Alquileres(id_alquiler),
    FOREIGN KEY (id_insumo) REFERENCES Insumos(id_insumo)
);


CREATE TABLE Tecnicos (
    id_tecnico INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tecnico VARCHAR(100),
    telefono VARCHAR(50),
    email VARCHAR(100)
);


CREATE TABLE SolicitudesMantenimiento (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    id_alquiler INT,
    fecha_solicitud DATE,
    descripcion TEXT,
    id_tecnico_asignado INT,
    fecha_asignacion DATE,
    fecha_resolucion DATE,
    FOREIGN KEY (id_alquiler) REFERENCES Alquileres(id_alquiler),
    FOREIGN KEY (id_tecnico_asignado) REFERENCES Tecnicos(id_tecnico)
);

CREATE USER 'admin_marloy'@'localhost' IDENTIFIED BY 'super_password';
GRANT ALL PRIVILEGES ON CafesMarloy.* TO 'admin_marloy'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
