<template>
  <header class="hdr">
    <nav class="nav">
      <strong class="brand">Mi E‑Commerce</strong>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/courses">Cursos</RouterLink>
      <RouterLink to="/cart">Carrito</RouterLink>
      <span class="spacer"></span>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/register">Registro</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.hdr { border-bottom: 1px solid #ececec; }
.nav { display:flex; gap:.75rem; align-items:center; padding: .9rem 1rem; }
.brand { margin-right:.5rem; }
.spacer { margin-left: auto; }
a { text-decoration: none; color: #2563eb; }
a.router-link-active { text-decoration: underline; }
</style>