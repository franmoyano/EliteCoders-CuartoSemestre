<template>
  <section class="hero-section">
    <img src="@/assets/hero/hero-learning.jpg" alt="Hero" class="hero-img" />
    <div class="hero-content">
      <h1>Bienvenido a nuestro proyecto E-Commerce Educativo</h1>
      <p>
        Nuestra plataforma combina aprendizaje y tecnología para ofrecer cursos online y presenciales, 
        enfocados en desarrollo web, UX/UI, marketing digital y mucho más. Conéctate con expertos, 
        mejora tus habilidades y lleva tu carrera al siguiente nivel.
      </p>
    </div>
  </section>
</template>

<script setup>
// Lógica que ya tenías
</script>

<style scoped>
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  padding: 2rem 1rem;
}

.hero-img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 20px;
}

.hero-content {
  max-width: 800px;
  font-size: 1.1rem;
  line-height: 1.6;
}
</style>
