-- Insertar alquileres con fechas de 2025 para pruebas
USE CafesMarloy;

-- Insertar alquileres adicionales con fechas de 2025
INSERT INTO Alquileres (id_maquina, id_cliente, fecha_inicio, fecha_fin, ganancias_maquina_total, coste_total_alquiler) VALUES 
(4, 1, '2025-01-01', '2025-12-31', 0.00, 0.00),
(1, 2, '2025-02-01', '2025-11-30', 0.00, 0.00),
(2, 3, '2025-03-01', '2025-10-31', 0.00, 0.00);

-- Verificar alquileres insertados
SELECT 
    a.id_alquiler,
    a.fecha_inicio,
    a.fecha_fin,
    m.modelo,
    m.marca,
    c.nombre_empresa
FROM Alquileres a
JOIN Maquinas m ON a.id_maquina = m.id_maquina
JOIN Clientes c ON a.id_cliente = c.id_cliente
ORDER BY a.fecha_inicio DESC; 