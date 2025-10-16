# Frontend Clean (Vue 3 + Vite)

Proyecto mínimo y limpio con estructura, routing básico y layout general.

## Requisitos
- Node.js 18+ (recomendado 20 LTS)
- npm 9+

## Instalación
```despues de haber hecho

pip install -r requirements.txt

```  me pociciono en frontent
cd frontend

luego tal cual instalo

```bash
npm install
```

## Desarrollo
```bash
npm run dev
# abre el enlace que imprime (p.ej. http://localhost:5173)
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
  components/
    ui/
      AppHeader.vue
      AppFooter.vue
  layouts/
    DefaultLayout.vue
  pages/
    Home.vue
    Courses.vue
    CourseDetail.vue
    Cart.vue
    Login.vue
    Register.vue
    NotFound.vue
  router/
    index.js
  styles/
    (puedes agregar .css aquí si quieres)
  App.vue
  main.js
```

## Notas
- Alias `@` apunta a `src` (configurado en `vite.config.js`).
- Rutas lazy‑loaded, incluye 404.
- Layout general con `<router-view/>` entre header y footer.