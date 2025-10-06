- GitFlow: usar ramas main, develop y feature branches por issue.
- Issues por historia de usuario con criterios de aceptación claros.
- Pull Requests obligatorios con code review de al menos 1 compañero de la misma sección.
- Daily (15 min) → Avances, bloqueos, plan de hoy.
- Review al final de cada sprint con demo.
- Prioridades iniciales: repositorio, base de datos, API de autenticación y CRUD básico, prototipo de pantallas.

## Guía de Instalación y Configuración

Sigue estos pasos para configurar el entorno de desarrollo local.

### 1. Clona el repositorio
```bash
git clone https://github.com/PowerSystem2024/EliteCoders-CuartoSemestre.git
cd EliteCoders-CuartoSemestre
```

### 2. Crea y activa un Entorno Virtual

Es una buena práctica aislar las dependencias del proyecto en un entorno virtual.

```bash
# Crear el entorno virtual
python -m venv venv
```

```bash
# Activar en Windows
.\venv\Scripts\activate

# Activar en Linux / macOS
source venv/bin/activate
```

### 3. Instala las Dependencias

Todas las librerías de Python necesarias están listadas en el archivo `requirements.txt`. Instálalas con un solo comando:

```bash
pip install -r requirements.txt
```

### 4. Configura la Base de Datos

a. Accede a tu cliente de MySQL y crea una nueva base de datos.
```sql
CREATE DATABASE mi_ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
*(Puedes usar el nombre que prefieras)*.

b. Este proyecto utiliza un archivo `.env` para manejar las credenciales de forma segura. Copia el archivo de ejemplo:

```bash
# En Windows
copy .env.example .env

# En Linux / macOS
cp .env.example .env
```

c. Abre el nuevo archivo `.env` y rellena los valores con tus credenciales. Debería verse así:

```ini
# .env - Archivo de variables de entorno

DB_NAME=mi_ecommerce_db
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_HOST=localhost
DB_PORT=3306
```
*(Nota: Para que esto funcione, el archivo `settings.py` debe estar configurado para leer estas variables, usualmente con una librería como `python-decouple` o `django-environ`)*.

### 5. Aplica las Migraciones

Este comando creará todas las tablas en la base de datos que tu aplicación necesita.

```bash
python manage.py migrate
```

### 6. Cargar Datos Iniciales

Este proyecto incluye un archivo de datos iniciales (fixtures) para poblar la base de datos con categorías, instructores y cursos de ejemplo, asegurando que todos los desarrolladores comiencen con una base de datos consistente.

```bash
python manage.py loaddata initial_data.json
```

### 7. Crea un Superusuario

Necesitarás un usuario administrador para acceder al panel de Django (`/admin`).

```bash
python manage.py createsuperuser
```
Sigue las instrucciones en pantalla para crear tu usuario.

---

## Ejecutar el Proyecto

Una vez completada la instalación, puedes iniciar el servidor de desarrollo de Django.

```bash
python manage.py runserver
```

Ahora puedes abrir tu navegador y visitar:
* **Sitio principal:** `http://127.0.0.1:8000/`
* **Panel de Administración:** `http://127.0.0.1:8000/admin/`

---

## Manejo de Dependencias

### ¿Qué es `requirements.txt`?

Es el archivo que actúa como el "pom.xml" o "package.json" del proyecto. Contiene una lista de todas las librerías de Python de las que depende el proyecto, asegurando que todos los desarrolladores trabajen con las mismas versiones.

### ¿Cómo añadir una nueva dependencia?

1.  Instala el paquete que necesites con pip (asegúrate de que tu `venv` esté activo).
    ```bash
    pip install nombre-del-paquete
    ```

2.  Actualiza el archivo `requirements.txt` para incluir el nuevo paquete.
    ```bash
    pip freeze > requirements.txt
    ```

3.  Añade el archivo actualizado a Git para que tus compañeros puedan recibir los cambios.
    ```bash
    git add requirements.txt
    git commit -m "feat: Añadir dependencia <nombre-del-paquete>"
    git push
    ```