# API Endpoints - Sistema de Gestión de Cafés Marloy

## Base URL
```
http://localhost:5000
```

## Autenticación y Usuarios (`/auth`)

### Registro de Cliente
- **POST** `/auth/registro/cliente`
- **Body:**
```json
{
  "nombre_usuario": "string",
  "email": "string",
  "password": "string",
  "nombre_empresa": "string",
  "direccion": "string",
  "telefono": "string"
}
```

### Registro de Administrador
- **POST** `/auth/registro/admin`
- **Body:**
```json
{
  "nombre_usuario": "string",
  "email": "string",
  "password": "string"
}
```

### Login
- **POST** `/auth/login`
- **Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Obtener Roles
- **GET** `/auth/roles`

### Obtener Usuario por ID
- **GET** `/auth/usuario/{id_usuario}`

### Actualizar Usuario
- **PUT** `/auth/usuario/{id_usuario}`
- **Body:**
```json
{
  "nombre_usuario": "string",
  "email": "string",
  "password": "string" // opcional
}
```

### Eliminar Usuario
- **DELETE** `/auth/usuario/{id_usuario}`

## Clientes (`/cliente`)

### Obtener Todos los Clientes
- **GET** `/cliente/`

### Crear Cliente
- **POST** `/cliente/`
- **Body:**
```json
{
  "rut": "string",
  "nombre_empresa": "string",
  "direccion": "string",
  "telefono": "string"
}
```

### Actualizar Cliente
- **PUT** `/cliente/{id_cliente}`
- **Body:** (mismo formato que crear)

### Eliminar Cliente
- **DELETE** `/cliente/{id_cliente}`

### Obtener ID de Cliente por RUT
- **GET** `/cliente/id-cliente/{id_usuario}`

### Obtener Alquileres por Cliente
- **GET** `/cliente/alquileres-cliente/{id_cliente}`

### Solicitar Mantenimiento
- **POST** `/cliente/solicitudes`
- **Body:**
```json
{
  "id_alquiler": "integer",
  "descripcion": "string"
}
```

### Obtener Ganancias por Máquina
- **GET** `/cliente/ganancias-maquina/{id_cliente}`

### Obtener Ganancias Totales
- **GET** `/cliente/ganancias-totales/{id_cliente}`

### Obtener Detalle de Alquiler
- **GET** `/cliente/alquiler-detalle/{id_alquiler}`

### Obtener Máquinas Disponibles
- **GET** `/cliente/maquinas/disponibles`

### Crear Alquiler
- **POST** `/cliente/alquileres`
- **Body:**
```json
{
  "id_cliente": "integer",
  "id_maquina": "integer",
  "fecha_inicio": "YYYY-MM-DD",
  "fecha_fin": "YYYY-MM-DD"
}
```

## Proveedores (`/proveedor`)

### Obtener Todos los Proveedores
- **GET** `/proveedor/`

### Crear Proveedor
- **POST** `/proveedor/`
- **Body:**
```json
{
  "nombre_proveedor": "string",
  "telefono": "string",
  "email": "string",
  "direccion": "string"
}
```

### Actualizar Proveedor
- **PUT** `/proveedor/{id_proveedor}`
- **Body:** (mismo formato que crear)

### Eliminar Proveedor
- **DELETE** `/proveedor/{id_proveedor}`

### Obtener Proveedor por ID
- **GET** `/proveedor/{id_proveedor}`

## Insumos (`/insumo`)

### Obtener Todos los Insumos
- **GET** `/insumo/`

### Crear Insumo
- **POST** `/insumo/`
- **Body:**
```json
{
  "nombre_insumo": "string",
  "unidad_medida": "string",
  "costo_unitario": "decimal",
  "id_proveedor": "integer"
}
```

### Actualizar Insumo
- **PUT** `/insumo/{id_insumo}`
- **Body:** (mismo formato que crear)

### Eliminar Insumo
- **DELETE** `/insumo/{id_insumo}`

### Obtener Insumo por ID
- **GET** `/insumo/{id_insumo}`

### Obtener Insumos por Proveedor
- **GET** `/insumo/proveedor/{id_proveedor}`

## Máquinas (`/maquina`)

### Obtener Todas las Máquinas
- **GET** `/maquina/`

### Crear Máquina
- **POST** `/maquina/`
- **Body:**
```json
{
  "modelo": "string",
  "marca": "string",
  "capacidad_cafe": "decimal",
  "capacidad_agua": "decimal",
  "costo_mensual_alquiler": "decimal",
  "porcentaje_ganancia_empresa": "integer",
  "estado": "boolean"
}
```

### Actualizar Máquina
- **PUT** `/maquina/{id_maquina}`
- **Body:** (mismo formato que crear)

### Eliminar Máquina
- **DELETE** `/maquina/{id_maquina}`

### Obtener Máquina por ID
- **GET** `/maquina/{id_maquina}`

### Obtener Máquinas Alquiladas
- **GET** `/maquina/alquiladas`

### Obtener Máquinas Disponibles
- **GET** `/maquina/disponibles`

### Obtener Máquinas por Cliente
- **GET** `/maquina/cliente/{id_cliente}`

### Obtener Máquinas con Cafés
- **GET** `/maquina/con-cafes`

## Técnicos (`/tecnico`)

### Obtener Todos los Técnicos
- **GET** `/tecnico/`

### Crear Técnico
- **POST** `/tecnico/`
- **Body:**
```json
{
  "nombre_tecnico": "string",
  "telefono": "string",
  "email": "string"
}
```

### Actualizar Técnico
- **PUT** `/tecnico/{id_tecnico}`
- **Body:** (mismo formato que crear)

### Eliminar Técnico
- **DELETE** `/tecnico/{id_tecnico}`

### Obtener Técnico por ID
- **GET** `/tecnico/{id_tecnico}`

### Obtener Técnicos Disponibles
- **GET** `/tecnico/disponibles`

## Mantenimientos (`/mantenimiento`)

### Obtener Todas las Solicitudes
- **GET** `/mantenimiento/`

### Crear Solicitud de Mantenimiento
- **POST** `/mantenimiento/`
- **Body:**
```json
{
  "id_alquiler": "integer",
  "descripcion": "string",
  "id_tecnico_asignado": "integer" // opcional
}
```

### Actualizar Solicitud
- **PUT** `/mantenimiento/{id_solicitud}`
- **Body:**
```json
{
  "descripcion": "string",
  "id_tecnico_asignado": "integer" // opcional
}
```

### Completar Solicitud
- **PUT** `/mantenimiento/{id_solicitud}/completar`

### Eliminar Solicitud
- **DELETE** `/mantenimiento/{id_solicitud}`

### Obtener Solicitud por ID
- **GET** `/mantenimiento/{id_solicitud}`

### Obtener Solicitudes Pendientes
- **GET** `/mantenimiento/pendientes`

### Obtener Solicitudes por Técnico
- **GET** `/mantenimiento/tecnico/{id_tecnico}`

## Cafés (`/cafe`)

### Obtener Todos los Cafés
- **GET** `/cafe/`

### Crear Café
- **POST** `/cafe/`
- **Body:**
```json
{
  "nombre_cafe": "string",
  "precio_venta": "decimal",
  "descripcion": "string"
}
```

### Actualizar Café
- **PUT** `/cafe/{id_cafe}`
- **Body:** (mismo formato que crear)

### Eliminar Café
- **DELETE** `/cafe/{id_cafe}`

### Obtener Café por ID
- **GET** `/cafe/{id_cafe}`

### Obtener Cafés por Máquina
- **GET** `/cafe/maquina/{id_maquina}`

### Agregar Café a Máquina
- **POST** `/cafe/maquina/{id_maquina}/cafe/{id_cafe}`

### Eliminar Café de Máquina
- **DELETE** `/cafe/maquina/{id_maquina}/cafe/{id_cafe}`

## Ventas y Reportes (`/venta`)

### Obtener Ventas por Período
- **GET** `/venta/periodo?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD`

### Obtener Consumo de Insumos
- **GET** `/venta/consumo-insumos?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD`

### Obtener Alquileres Activos
- **GET** `/venta/alquileres-activos`

### Obtener Estadísticas de Ventas
- **GET** `/venta/estadisticas?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD`

### Obtener Costos y Rendimiento
- **GET** `/venta/costos-rendimiento?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD`

### Obtener Ganancias
- **GET** `/venta/ganancias?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD`

## Códigos de Respuesta

- **200**: OK - Operación exitosa
- **201**: Created - Recurso creado exitosamente
- **400**: Bad Request - Datos inválidos o faltantes
- **401**: Unauthorized - Credenciales inválidas
- **404**: Not Found - Recurso no encontrado
- **500**: Internal Server Error - Error del servidor

## Ejemplos de Uso

### Crear un nuevo cliente
```bash
curl -X POST http://localhost:5000/auth/registro/cliente \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_usuario": "Juan Pérez",
    "email": "juan@empresa.com",
    "password": "password123",
    "nombre_empresa": "Café Express",
    "direccion": "Av. Principal 123",
    "telefono": "099123456"
  }'
```

### Obtener todas las máquinas disponibles
```bash
curl -X GET http://localhost:5000/maquina/disponibles
```

### Crear una solicitud de mantenimiento
```bash
curl -X POST http://localhost:5000/mantenimiento/ \
  -H "Content-Type: application/json" \
  -d '{
    "id_alquiler": 1,
    "descripcion": "La máquina no calienta el agua",
    "id_tecnico_asignado": 1
  }'
``` 