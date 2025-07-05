# ObligatorioBDDI2025 - Cafés Marloy

Sistema de gestión para el alquiler de máquinas de café con funcionalidades completas de autenticación, gestión de clientes, máquinas, ventas y mantenimientos.

## Características Implementadas

### Backend (Flask + MySQL)
- API REST completa con endpoints para todas las entidades
- Autenticación y autorización de usuarios
- Gestión de clientes, máquinas, cafés, insumos, proveedores, técnicos, ventas y mantenimientos
- Base de datos MySQL con relaciones complejas

### Frontend (React + Vite)
- **Sistema de Autenticación**: Login y registro de usuarios
- **Dashboard Responsivo**: Interfaz adaptada para diferentes roles
- **Diseño Moderno**: UI/UX atractiva y funcional
- **Protección de Rutas**: Solo usuarios autenticados pueden acceder

## Instalación y Configuración

### Prerrequisitos
- Python 3.8+
- Node.js 18+
- MySQL 8.0+
- Git

### Base de Datos
1. Ejecutar el script de creación de la base de datos:
   ```sql
   source backend/script.sql
   ```

2. Insertar datos de prueba:
   ```sql
   source backend/inserts.sql
   ```

3. (Opcional) Insertar usuarios de prueba:
   ```sql
   source backend/usuarios_prueba.sql
   ```

### en backend

1. **Crear entorno virtual**:
   ```bash
   python -m venv venv
   ```

2. **Activar entorno virtual**:
   - Git bash: `source venv/Scripts/activate`
   - PowerShell: `.\venv\Scripts\Activate.ps1`
   - CMD: `.\venv\Scripts\activate`

3. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Ejecutar Flask**:
   ```bash
   python app.py
   ```

El backend estará disponible en `http://localhost:5000`

### Frontend

1. **Instalar dependencias**:
   ```bash
   cd frontend
   npm install
   ```

2. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

El frontend estará disponible en `http://localhost:5173`

### Scripts de Inicio Rápidos

- **Backend**: `start.bat` (ya existente)
- **Frontend**: `start_frontend.bat` (nuevo)

## Usuarios de Prueba

Si ejecutaste `usuarios_prueba.sql`, puedes usar:

### Cliente
- **Email**: `cliente@test.com`
- **Contraseña**: `password123`

### Administrador
- **Email**: `admin@test.com`
- **Contraseña**: `password123`

## Funcionalidades del Frontend

### Autenticación
- ✅ Login con validación de credenciales
- ✅ Registro de nuevos usuarios (Cliente/Administrador)
- ✅ Mensajes de error específicos
- ✅ Protección de rutas

### Dashboard
- ✅ Información del usuario logueado
- ✅ Funcionalidades diferenciadas por rol
- ✅ Diseño responsivo y moderno
- ✅ Navegación intuitiva

### Próximas Funcionalidades
- Gestión completa de clientes
- Gestión de máquinas y alquileres
- Gestión de ventas y reportes
- Gestión de mantenimientos
- Gestión de insumos y proveedores

## Estructura del Proyecto

```
ObligatorioBDDI2025/
├── backend/                 # API Flask
│   ├── routes/             # Endpoints de la API
│   │   ├── pages/          # Páginas principales
│   │   ├── components/     # Componentes reutilizables
│   │   ├── services/       # Servicios de API
│   │   └── context/        # Contextos de React
│   └── package.json
├── start.bat              # Script inicio backend
├── start_frontend.bat     # Script inicio frontend
└── README.md
```

## Tecnologías Utilizadas

### Backend
- **Flask**: Framework web
- **MySQL**: Base de datos
- **Flask-CORS**: Manejo de CORS
- **bcrypt**: Hash de contraseñas

### Frontend
- **React 19**: Framework de JavaScript
- **Vite**: Herramienta de construcción
- **React Router**: Enrutamiento
- **Axios**: Cliente HTTP
- **CSS3**: Estilos modernos
