<script setup>
import { ref } from 'vue'
const metodo = ref('tc') // 'tc' o 'tr'
</script>

<template>
  <section class="container">
    <h2 class="h1">Información de usuario</h2>
    <div class="sidebar-grid">
      <div class="card">
        <div class="form-grid">
          <div class="field"><label>Nombre</label><input class="input" placeholder=""/></div>
          <div class="field"><label>Apellidos</label><input class="input" placeholder=""/></div>
          <div class="field" style="grid-column:1/-1"><label>Correo electrónico</label><input class="input" placeholder=""/></div>
          <div class="field" style="grid-column:1/-1"><label>Teléfono</label><input class="input" placeholder=""/></div>
          <div class="field"><label>Número de Documento</label><input class="input" placeholder=""/></div>
        </div>
      </div>
      <aside class="card center" style="min-height:200px">Resumen de mi compra</aside>
    </div>

    <h2 class="h1" style="margin-top:1rem">Pago</h2>
    <div class="card">
      <div style="display:flex;gap:1rem;margin-bottom:1rem">
        <button :class="['btn', metodo==='tc'?'':'secondary']" @click="metodo='tc'">Tarjeta de Crédito</button>
        <button :class="['btn', metodo==='tr'?'':'secondary']" @click="metodo='tr'">Transferencia</button>
      </div>

      <div v-if="metodo==='tc'" class="form-grid">
        <div class="field" style="grid-column:1/-1"><label>Número de la tarjeta</label><input class="input" placeholder=""/></div>
        <div class="field"><label>Fecha de vencimiento</label><input class="input" placeholder="MM/AA"/></div>
        <div class="field"><label>Código de seguridad</label><input class="input" placeholder="CVC"/></div>
        <div class="field" style="grid-column:1/-1"><label>Nombre completo del titular</label><input class="input" placeholder=""/></div>
      </div>

      <div v-else class="form-grid">
        <div class="field" style="grid-column:1/-1"><label>CBU/alias</label><input class="input" placeholder=""/></div>
        <div class="field" style="grid-column:1/-1"><label>Titular de la cuenta</label><input class="input" placeholder=""/></div>
      </div>
    </div>
    <div style="padding:1rem 0">
      <router-link class="btn block" to="/success">PAGAR</router-link>
    </div>
  </section>
</template>
