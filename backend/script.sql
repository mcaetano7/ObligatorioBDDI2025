 
CREATE DATABASE CafesMarloy;
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

