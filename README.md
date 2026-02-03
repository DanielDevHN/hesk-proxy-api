# Hesk Tickets Proxy API 🚀

API intermedia desarrollada con **Node.js**, **Express** y **TypeScript** para la gestión moderna de tickets en el sistema **Hesk**. Este proyecto actúa como un puente (Proxy) para los procesos de subida de archivos y creación de tickets, además de ofrecer acceso directo a la base de datos MySQL para consultas rápidas.

## 📋 Características

- **Proxy de Adjuntos**: Maneja la subida temporal de archivos y su vinculación con el backend PHP de Hesk mediante `file_key`.
- **Integración MySQL**: Consultas directas y optimizadas para obtener categorías y detalles de tickets.
- **Documentación con Swagger**: Interfaz interactiva para pruebas de endpoints sin necesidad de Postman.
- **Clean Code**: Arquitectura basada en Controladores y Servicios para facilitar el mantenimiento.
- **Seguridad**: Uso de variables de entorno para proteger credenciales y URLs sensibles.
- **Watch Mode**: Auto-reinicio ultra rápido durante el desarrollo usando `tsx`.

---

## 🛠️ Requisitos Previos

- **Node.js**: v20.x o superior.
- **Base de Datos**: MySQL (Hesk instalado).
- **Herramientas**: `npm` o `yarn`.

---

## 🚀 Instalación y Configuración

1. **Instalar dependencias:**
   ```
   npm install
2. **Configurar el entorno: Crea un archivo .env en la raíz del proyecto basándote en lo siguiente:**
```
    PORT=3000
    PHP_BASE_URL=http://localhost:8081
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=tu_password
    DB_NAME=hesk
```
3. **Estructura de Carpetas: La carpeta uploads/ se creará automáticamente para almacenar temporalmente los archivos antes del submit final.**

## 🏃 Ejecución

**Desarrollo (Watch Mode)**
- **Ejecuta el servidor con reinicio automático al detectar cambios:**
```
npm run dev
```
**Producción**
- **Para desplegar la aplicación en un entorno real:**
```
npm run build
npm start
```

## 📖 Endpoints Disponibles

**La API está documentada con Swagger. Puedes ver y probar todos los endpoints en: 👉**

``` 
http://localhost:3000/api-docs
```

|Método	|     Endpoint	    | Descripción                                 |
|-------|:----------------- |:--------------------------------------------|  
|GET	|/api/categories    |   Obtiene las categorías desde MySQL.       |
|GET	|/api/tickets	    |   Lista los tickets recientes desde MySQL.  |
|GET	|/api/tickets/:id   |   Detalle de un ticket por ID o TrackID.    |
|POST	|/api/proxy/upload  |   Sube un adjunto y retorna una file_key.   |
|POST	|/api/proxy/submit  |   Crea el ticket final en el servidor Hesk. |


## 📁 Estructura del proyecto
```
api-hesk/
├── src/
│   ├── controllers/    # Lógica de manejo de peticiones
│   ├── services/       # Capa de datos y consultas SQL
│   ├── docs/           # Definiciones de Swagger (JSON)
│   ├── config/         # Configuración del Pool de MySQL
│   └── index.ts        # Punto de entrada de la aplicación
├── uploads/            # Carpeta temporal de archivos
├── .env                # Variables de entorno
└── tsconfig.json       # Configuración de TypeScript
```

## ⚠️ Notas de Desarrollo (Troubleshooting)
**Debido al uso de ES Modules (ESM) en este proyecto, recuerda:**

- **Todos los import de archivos locales deben incluir la extensión ```.js``` (ej: ```import { x } from './file.js'```), aunque el archivo físico sea ```.ts.```**

- **Si tienes errores de resolución de módulos, asegúrate de estar ejecutando con ```tsx```.**

###
Desarrollado con ❤️ por **Daniel**
