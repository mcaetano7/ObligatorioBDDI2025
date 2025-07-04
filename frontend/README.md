# Frontend - Cafés Marloy

Este es el frontend de la aplicación Cafés Marloy, desarrollado con React y Vite.

## Características Implementadas

### Autenticación
- **Pantalla de Login**: Formulario de inicio de sesión con validación
- **Registro de Usuarios**: Formulario para registrar nuevos usuarios (Cliente o Administrador)
- **Manejo de Errores**: Mensajes de error específicos para credenciales incorrectas
- **Protección de Rutas**: Solo usuarios autenticados pueden acceder al dashboard

### Dashboard
- **Información del Usuario**: Muestra datos del usuario logueado
- **Funcionalidades por Rol**: Diferentes opciones según el tipo de usuario
- **Diseño Responsivo**: Interfaz adaptada para diferentes tamaños de pantalla

## Tecnologías Utilizadas

- **React 19.1.0**: Framework de JavaScript
- **React Router DOM 6.30.1**: Enrutamiento de la aplicación
- **Axios 1.10.0**: Cliente HTTP para llamadas a la API
- **Vite 6.3.5**: Herramienta de construcción y desarrollo

## Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Backend de Cafés Marloy ejecutándose en `http://localhost:5000`

### Pasos para ejecutar

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**:
   La aplicación estará disponible en `http://localhost:5173`

### Scripts Disponibles

- `npm run dev`: Ejecuta el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la versión de producción
- `npm run lint`: Ejecuta el linter para verificar el código

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── ProtectedRoute.jsx
├── context/            # Contextos de React
│   └── AuthContext.jsx
├── pages/              # Páginas de la aplicación
│   ├── Login.jsx
│   ├── Login.css
│   ├── Dashboard.jsx
│   └── Dashboard.css
├── services/           # Servicios para llamadas a la API
│   └── authService.js
├── App.jsx             # Componente principal
└── main.jsx           # Punto de entrada
```

## Funcionalidades

### Login
- Formulario de inicio de sesión con email y contraseña
- Validación de campos requeridos
- Mensaje de error específico para credenciales incorrectas
- Botón para cambiar al formulario de registro

### Registro
- Selección de tipo de usuario (Cliente o Administrador)
- Campos específicos según el tipo de usuario:
  - **Cliente**: nombre de empresa, dirección, teléfono
  - **Administrador**: solo datos básicos
- Validación de contraseñas coincidentes
- Mensaje de éxito y redirección automática

### Dashboard
- **Para Clientes**:
  - Mis Alquileres
  - Mis Ventas
  - Solicitar Mantenimiento

- **Para Administradores**:
  - Gestionar Clientes
  - Gestionar Máquinas
  - Gestionar Cafés
  - Gestionar Insumos
  - Gestionar Proveedores
  - Gestionar Técnicos
  - Gestionar Ventas
  - Gestionar Mantenimientos

## Configuración de la API

El frontend está configurado para comunicarse con el backend en `http://localhost:5000`. Si necesitas cambiar esta URL, modifica la constante `API_URL` en `src/services/authService.js`.

## Notas de Desarrollo

- La aplicación utiliza el contexto de React para manejar el estado de autenticación
- Los datos del usuario se almacenan en localStorage para persistencia
- Las rutas están protegidas para usuarios no autenticados
- El diseño es completamente responsivo y moderno

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


