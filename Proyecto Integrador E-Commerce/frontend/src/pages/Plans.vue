<template>
  <section class="plans-section">
    <img src="@/assets/hero/plans-banner.jpg" alt="Planes" class="plan-img" />
    <h2>Nuestros Planes</h2>
    <p>
      Ofrecemos distintos planes pensados para ajustarse a tus necesidades:
      cursos online, presenciales y mixtos. Cada plan incluye recursos descargables,
      tutorías personalizadas y acceso a nuestra comunidad de aprendizaje.
    </p>

    <div class="plans-grid">
      <div class="plan-card">
        <h3>Plan Básico</h3>
        <p>Acceso a 2 cursos introductorios</p>
        <p>Modalidad: Online</p>
        <RouterLink to="/courses/1" class="btn">Ver Cursos</RouterLink>
      </div>

      <div class="plan-card">
        <h3>Plan Profesional</h3>
        <p>Acceso a todos los cursos</p>
        <p>Modalidad: Online + Tutorías</p>
        <RouterLink to="/courses" class="btn">Explorar Todos</RouterLink>
      </div>

      <div class="plan-card">
        <h3>Plan Premium</h3>
        <p>Incluye mentorías y soporte personalizado</p>
        <p>Modalidad: Online / Presencial</p>
        <RouterLink to="/courses/4" class="btn">Ir al Curso de Marketing</RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
// sin cambios de lógica
</script>


<style scoped>
.plans-section {
  padding: 2rem;
  text-align: center;
}

.plan-img {
  width: 100%;
  max-height: 350px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 25px;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

/* 👇 Forzamos fondo claro y texto oscuro dentro de cada card */
.plan-card {
  background: #ffffff;             /* fondo claro */
  color: #0f172a;                  /* color de texto por defecto */
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.5rem;
  transition: 0.3s;
  text-align: left;                /* opcional */
}

.plan-card h3 {
  color: #0f172a;                  /* título bien oscuro */
  margin: 0 0 .25rem 0;
  font-weight: 700;
}

.plan-card p {
  color: #334155;                  /* párrafos gris oscuro legible */
  margin: .15rem 0;
}

.plan-card:hover {
  transform: translateY(-5px);
  background: #f8fafc;             /* hover sutil */
  border-color: #cbd5e1;
}

/* Botón */
.btn {
  display: inline-block;
  background-color: #1976d2;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  margin-top: 1rem;
  transition: background 0.3s;
}
.btn:hover { background-color: #1259a6; }
</style>
