# TranspoBolivia - Sistema de Gestión de Transporte

## Descripción del Proyecto

TranspoBolivia es un sistema integral de gestión de transporte diseñado para optimizar la administración de rutas, vehículos, conductores, horarios y reservas. La aplicación consta de un frontend interactivo desarrollado con React y un robusto backend construido con NestJS, utilizando PostgreSQL como base de datos.

## Características Principales

*   **Gestión de Usuarios:** Registro y autenticación de usuarios, incluyendo roles de operador y cliente.
*   **Gestión de Rutas:** Creación, edición y eliminación de rutas de transporte.
*   **Gestión de Vehículos:** Administración de la flota de vehículos, incluyendo detalles y estado.
*   **Gestión de Conductores:** Registro y seguimiento de la información de los conductores.
*   **Gestión de Horarios:** Definición y asignación de horarios para las rutas y vehículos.
*   **Gestión de Reservas:** Sistema de reservas de pasajes para los clientes.
*   **Asistente de IA:** Integración con Gemini para asistencia inteligente (frontend).

## Tecnologías Utilizadas

*   **Frontend:**
    *   React (con Vite)
    *   TypeScript
    *   Axios
    *   React Router DOM
    *   Leaflet (para mapas)
    *   @google/genai (para integración con Gemini)
    *   Nginx (servidor web)
*   **Backend:**
    *   NestJS
    *   TypeScript
    *   TypeORM (con PostgreSQL)
    *   Passport (autenticación JWT y Local)
    *   Bcrypt (para hashing de contraseñas)
*   **Base de Datos:**
    *   PostgreSQL
*   **Orquestación:**
    *   Docker
    *   Docker Compose

## Requisitos Previos

Para ejecutar este proyecto, necesitarás tener instalado lo siguiente en tu sistema:

*   **Docker:** [Instalar Docker](https://docs.docker.com/get-docker/)
*   **Docker Compose:** (Generalmente viene incluido con la instalación de Docker Desktop)

## Despliegue y Ejecución Local

Sigue estos pasos para levantar la aplicación completa en tu entorno local usando Docker Compose:

### 1. Clonar el Repositorio

Primero, clona el repositorio de GitHub a tu máquina local:

```bash
git clone https://github.tu-usuario/transpobolivia.git # Reemplaza con la URL real del repositorio
cd transpobolivia
```

### 2. Configuración de Variables de Entorno

El proyecto utiliza variables de entorno para la configuración de la base de datos y los puertos de los servicios.

Copia el archivo `.env.example` (en la raíz del proyecto) a `.env` y ajusta los valores según tus preferencias:

```bash
cp .env.example .env
```

Contenido de `.env.example`:

```
# --- Configuración General del Entorno ---

# Puertos expuestos en tu máquina (HOST). Cámbialos si están ocupados.
FRONTEND_PORT=5173
BACKEND_PORT=3000
DB_PORT=5433

# Credenciales para la base de datos PostgreSQL
POSTGRES_DB=transpobolivia_db
POSTGRES_USER=user
POSTGRES_PASSWORD=password
```

**Nota:** Si tu proyecto utiliza variables de entorno adicionales (como claves API o secretos JWT) que no están en este ejemplo, asegúrate de añadirlas a tu archivo `.env` y de que estén configuradas correctamente en tu aplicación.

### 3. Levantar la Aplicación con Docker Compose

Una vez configurados los archivos `.env`, puedes construir y levantar todos los servicios (base de datos, backend y frontend) con un solo comando:

```bash
docker-compose up --build -d
```

*   `--build`: Reconstruye las imágenes de Docker (útil la primera vez o después de cambios en el código o Dockerfiles).
*   `-d`: Ejecuta los contenedores en modo "detached" (en segundo plano).

### 4. Acceder a la Aplicación

Una vez que los contenedores estén en funcionamiento:

*   **Frontend:** Abre tu navegador web y navega a `http://localhost:80` (o el puerto que hayas configurado para el frontend en `docker-compose.yml` si lo modificaste).
*   **Backend API:** La API del backend estará disponible en `http://localhost:3000/api` (o el puerto configurado).

### 5. Detener la Aplicación

Para detener y eliminar los contenedores, redes y volúmenes creados por Docker Compose, ejecuta:

```bash
docker-compose down -v
```

*   `-v`: También elimina los volúmenes de datos, lo que significa que perderás los datos de la base de datos. Si quieres conservar los datos, omite `-v`.

## Estructura del Proyecto

*   `./`: Contiene el código fuente del frontend (React/Vite), `Dockerfile` para el frontend, `nginx.conf` y `docker-compose.yml`.
*   `./backend/`: Contiene el código fuente de la aplicación backend (NestJS), su `Dockerfile` y archivos de configuración.
*   `./postgres-data/`: Volumen persistente para los datos de PostgreSQL.

---

¡Disfruta usando TranspoBolivia!