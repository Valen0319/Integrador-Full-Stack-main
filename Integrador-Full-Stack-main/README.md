# To-Do List App

Una aplicación de lista de tareas con autenticación de usuarios, desarrollada con React (frontend) y Node.js/Express (backend).

## Características

- ✅ Autenticación de usuarios (registro y login)
- ✅ Gestión de tareas (crear, leer, actualizar, eliminar)
- ✅ Panel de administración
- ✅ Interfaz responsive y moderna
- ✅ Notificaciones toast
- ✅ Protección de rutas

## Tecnologías

### Backend
- Node.js
- Express.js
- MySQL
- JWT para autenticación
- bcryptjs para encriptación de contraseñas
- CORS habilitado

### Frontend
- React 19
- Vite
- React Router DOM
- Axios para peticiones HTTP
- React Toastify para notificaciones
- Context API para manejo de estado

## Instalación

### Prerrequisitos
- Node.js (versión 16 o superior)
- MySQL
- Git

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   ```

2. **Configurar la base de datos**
   - Abrir MySQL Workbench y ejecutar el archivo `Structure.sql`
   - O ejecutar manualmente:
     ```sql
     CREATE DATABASE todo_list;
     USE todo_list;
     -- Ejecutar el contenido de Structure.sql
     ```

3. **Configurar variables de entorno**
   - El archivo `.env` del backend ya está configurado con valores por defecto
   - El archivo `.env` del frontend ya está configurado con la URL del API

4. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   ```

5. **Instalar dependencias del frontend**
   ```bash
   cd ../frontend
   npm install
   ```

## Uso

### Opción 1: Usar el script de inicio automático (Windows)
```bash
start.bat
```

### Opción 2: Iniciar manualmente

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Acceso a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

## Usuarios por defecto

- **Administrador**: 
  - Email: admin@admin.com
  - Contraseña: admin123

## Estructura del proyecto

```
to-do-list-main/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuración de base de datos
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── middlewares/     # Middlewares de autenticación
│   │   ├── models/          # Modelos de datos
│   │   ├── routes/          # Definición de rutas
│   ├── server.js            # Servidor principal
│   ├── .env                 # Configuración del servidor
│   ├── package-lock.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Configuración de Axios
│   │   ├── assets/          #
│   │   ├── components/      # Componentes reutilizables
│   │   ├── context/         # Contexto de autenticación
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── styles/          # Estilos de páginas y componentes
│   │   ├── utils/           # Funciones para tratar token
│   │   ├── App.css          # Estilos principales
│   │   ├── App.jsx          # Toast notifications y direccionamiento de rutas
│   │   ├── index.css        # Estilos principales
│   │   ├── main.jsx         # 
│   ├── .env                 # Configuración de URL api del backend
│   ├── index.html           # Estructura de la web
│   ├── package-lock.json
│   └── package.json
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Tareas
- `GET /api/tasks` - Obtener tareas del usuario
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

## Desarrollo

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## Autores

Guerrero Lautaro y Arroyo Valentin

## Licencia

Este proyecto está bajo la Licencia MIT.

