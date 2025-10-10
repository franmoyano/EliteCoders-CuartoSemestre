Perfecto 😤 acá lo tenés **completo y listo**, todo en **formato Markdown (.md)**, para copiar y pegar directo en tu `README.md` — sin explicaciones ni adornos.

---

```markdown
## Frontend – Vue.js + Vite

Se configuró el entorno base del frontend utilizando **Vue 3 + Vite**, con estructura inicial, routing básico y layout general.

---

### 🗂️ Estructura del proyecto

El proyecto se encuentra dentro de la carpeta `frontend/` con la siguiente estructura principal:

```

frontend/
├─ index.html
├─ vite.config.js
├─ package.json
└─ src/
├─ assets/
├─ components/
│   ├─ ui/
│   │   ├─ AppHeader.vue
│   │   └─ AppFooter.vue
│   └─ CourseCard.vue
├─ layouts/
│   └─ DefaultLayout.vue
├─ pages/
│   ├─ Home.vue
│   ├─ Courses.vue
│   ├─ CourseDetail.vue
│   ├─ Cart.vue
│   ├─ Login.vue
│   ├─ Register.vue
│   └─ NotFound.vue
├─ router/
│   └─ index.js
├─ store/
│   └─ index.js
├─ services/
│   └─ api.js
├─ styles/
│   └─ tailwind.css
├─ App.vue
└─ main.js

````

---

### ⚙️ Dependencias utilizadas

- **Vue 3**  
- **Vite**  
- **Vue Router**  
- **Pinia**  
- **Axios**  
- **TailwindCSS** (configurado para estilos base)

---

### 🧩 Instalación y ejecución

Desde la raíz del repositorio:

```bash
cd frontend
npm install
npm run dev
````

El proyecto se ejecuta en:
👉 [http://localhost:5173](http://localhost:5173)

---

### 🌐 Configuración del router

Se implementó routing básico en `src/router/index.js` con las siguientes rutas:

* `/` → Home
* `/courses` → Listado de cursos
* `/courses/:id` → Detalle de curso
* `/cart` → Carrito
* `/login` → Iniciar sesión
* `/register` → Registro
* `/*` → Página no encontrada

---

### 🧱 Layout general

Se creó un layout principal (`DefaultLayout.vue`) que incluye:

* **Header** → `AppHeader.vue`
* **Contenedor principal** con `<router-view />`
* **Footer** → `AppFooter.vue`

El archivo `App.vue` carga este layout general.

---

### 🔗 Cliente HTTP

Se configuró un cliente **Axios** en `src/services/api.js` con la variable de entorno:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```


### 🧱 Scripts adicionales

Para construir la aplicación de producción:

```bash
npm run build
```

Para previsualizar la build:

```bash
npm run preview
```

```

---

✅ Listo para pegar directamente en tu `README.md` sin tocar nada.
```
