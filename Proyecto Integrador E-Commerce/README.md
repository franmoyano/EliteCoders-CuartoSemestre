## Estructura del proyecto 

### Banckend
backend/
├── manage.py                  # Script principal para comandos Django.
├── ecommerce/                 # Carpeta del proyecto principal (nombre configurable).
│   ├── __init__.py
│   ├── asgi.py                # Para aplicaciones asíncronas (WebSockets si lo necesitas).
│   ├── settings.py            # Configuraciones: apps instaladas, DB, middleware, etc.
│   ├── urls.py                # Rutas principales del proyecto.
│   └── wsgi.py                # Para deployment en servidores como Gunicorn.
├── core/                      # App para configuraciones generales o utilidades.
│   ├── migrations/            # Migraciones de la DB.
│   ├── __init__.py
│   ├── admin.py               # Panel admin de Django.
│   ├── apps.py
│   ├── models.py              # Modelos generales (e.g., configuraciones).
│   ├── tests.py               # Tests unitarios.
│   └── views.py               # Vistas generales.
├── users/                     # App para manejo de usuarios (autenticación, perfiles).
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py              # Modelos como UserProfile, Address.
│   ├── serializers.py         # Si usas Django REST Framework para API.
│   ├── tests.py
│   ├── urls.py                # Rutas específicas de la app (e.g., /api/users/).
│   └── views.py               # Vistas para login, registro, etc.
├── products/                  # App para productos (catálogo).
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py              # Modelos como Product, Category, Image.
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py               # Vistas/API para listar productos, detalles.
├── cart/                      # App para carrito de compras.
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py              # Modelos como Cart, CartItem.
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py               # Lógica para agregar/quitar items.
├── orders/                    # App para órdenes y pagos.
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py              # Modelos como Order, OrderItem, Payment.
│   ├── serializers.py
│   ├── tests.py
│   ├── urls.py
│   └── views.py               # Procesamiento de checkout.
├── static/                    # Archivos estáticos globales (CSS, JS, images) recolectados por Django.
├── media/                     # Archivos subidos por usuarios (e.g., imágenes de productos).

## Frontend
frontend/
├── public/                    # Archivos públicos (no procesados por webpack).
│   ├── index.html             # Plantilla principal.
│   ├── favicon.ico
│   └── robots.txt
├── src/                       # Código fuente principal.
│   ├── assets/                # Imágenes, fonts, etc.
│   │   ├── images/            # Logos, icons, product placeholders.
│   │   └── styles/            # CSS global o SCSS.
│   ├── components/            # Componentes reutilizables.
│   │   ├── Header.vue         # Barra de navegación.
│   │   ├── Footer.vue         # Pie de página.
│   │   ├── ProductCard.vue    # Tarjeta de producto.
│   │   ├── CartItem.vue       # Item en el carrito.
│   │   └── LoadingSpinner.vue # Componente de carga.
│   ├── views/                 # Vistas/páginas principales (rutas).
│   │   ├── Home.vue           # Página de inicio.
│   │   ├── ProductList.vue    # Lista de productos.
│   │   ├── ProductDetail.vue  # Detalle de producto.
│   │   ├── Cart.vue           # Carrito de compras.
│   │   ├── Checkout.vue       # Proceso de pago.
│   │   ├── Login.vue          # Página de login.
│   │   └── Profile.vue        # Perfil de usuario.
│   ├── router/                # Configuración de rutas (Vue Router).
│   │   └── index.js           # Define rutas como /products, /cart.
│   ├── store/                 # Estado global (Vuex o Pinia).
│   │   ├── index.js           # Store principal.
│   │   ├── modules/           # Módulos como cart.js, products.js.
│   │   │   ├── cart.js
│   │   │   └── products.js
│   ├── services/              # Servicios para API calls (e.g., Axios).
│   │   └── api.js             # Configura base URL para backend (e.g., http://localhost:8000/api/).
│   ├── App.vue                # Componente raíz.
│   └── main.js                # Entry point: monta la app, router, store.
├── node_modules/              # Dependencias (ignorado en git).
├── babel.config.js            # Config para transpilación.
├── package.json               # Dependencias (Vue, Vue Router, Vuex/Pinia, Axios, etc.).
├── package-lock.json          # Lockfile para versiones.

--- 

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

### 2. Crea y activa un Entorno Virtual (en la ruta raíz)

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
#### IMPORTANTE: ejecutar desde carpeta /backend

Este proyecto incluye un archivo de datos iniciales (fixtures) para poblar la base de datos con categorías, instructores y cursos de ejemplo, asegurando que todos los desarrolladores comiencen con una base de datos consistente.

```bash
python manage.py loaddata fixtures/initial_data.json
```

### 7. Crea un Superusuario
#### IMPORTANTE: ejecutar desde carpeta /backend

Necesitarás un usuario administrador para acceder al panel de Django (`/admin`).

```bash
python manage.py createsuperuser
```
Sigue las instrucciones en pantalla para crear tu usuario.

### 8. Crea un usuario "común"
Para crear un usuario común, se debe estar logueado como superusuario (admin - Paso 7).
Luego dirigirse a la siguiente URL: http://127.0.0.1:8000/api/v1/auth/users/

Veremos un formulario al final de la página donde cargaremos los datos de este nuevo usuario.

---

## 9. Ejecutar el Proyecto
#### IMPORTANTE: ejecutar desde carpeta /backend

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