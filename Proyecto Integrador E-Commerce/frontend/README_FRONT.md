
---

# Frontend Clean (Vue 3 + Vite)

Proyecto mínimo y limpio con estructura, **routing básico**, **layout general** y **pantallas maquetadas con datos mock** (sin API).

## Requisitos

* Node.js 18+ (recomendado 20 LTS)
* npm 9+

## Instalación

> El backend no es necesario para este sprint. Si vas a trabajar el back en paralelo, primero:

```bash
pip install -r requirements.txt
```

Ahora posicionate en el frontend:

```bash
cd frontend
npm install
```

## Desarrollo

```bash
npm run dev
# abre el enlace que imprime (ej: http://localhost:5173)
```

## Producción

```bash
npm run build
npm run preview
```

## Estructura

```
src/
  assets/
    styles.css          # estilos globales (tema oscuro + acento mint)
  components/
    ui/
      AppHeader.vue     # barra superior mint con menú
      AppFooter.vue     # barra inferior mint con redes
  layouts/
    DefaultLayout.vue   # header + <router-view/> + footer
  mocks/
    courses.js          # datos de cursos/lecciones (mock)
  pages/
    Home.vue            # About + secciones Cursos/Planes (maquetado)
    Courses.vue         # grid de cursos (mock)
    CourseDetail.vue    # detalle del curso (lista de "pills" + resumen)
    CourseLessons.vue   # listado de lecciones (mock)
    Checkout.vue        # formulario de usuario + pago (TC/Transferencia)
    Success.vue         # compra exitosa
    Cart.vue            # placeholder
    Login.vue           # placeholder
    Register.vue        # placeholder
    NotFound.vue        # 404
  router/
    index.js            # rutas lazy-loaded + scrollBehavior
  App.vue
  main.js               # monta la app e importa estilos globales
```

## Notas

* Alias `@` apunta a `src` (configurado en `vite.config.js`).
* Rutas **lazy-loaded** e incluye **404**.
* Layout general con `<router-view/>` entre header y footer.
* **Mock data**: `src/mocks/courses.js` (no se llama al backend).
* El estilo sigue la guía de Figma (fondo oscuro, barras mint, “pills” redondeadas y tarjetas).
* Los archivos `src/api/*` pueden quedar, pero **no se usan** en estas vistas.

## (Opcional) Preparado para Sprint 3 – pasar de Mock → API

Si en el siguiente sprint querés “cambiar a API real” sin tocar las pantallas, podés usar un toggle por entorno:

1. `.env`

   ```bash
   VITE_USE_MOCK=true   # Sprint 2 (mock)
   # VITE_USE_MOCK=false  # Sprint 3 (API real)
   # VITE_API_URL=http://127.0.0.1:8000/api/v1
   ```
2. Crear servicios con dos implementaciones (`src/services/courseService.mock.js` y `src/services/courseService.api.js`) y un **index** que elija según `VITE_USE_MOCK`.

   > Las vistas importan desde `@/services` y no cambian.

---
