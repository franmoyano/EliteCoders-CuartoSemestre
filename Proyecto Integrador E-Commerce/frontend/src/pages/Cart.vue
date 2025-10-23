<template>
  <section>
    <h1>Carrito</h1>

    <!-- Mensaje si está vacío -->
    <p v-if="!carrito || carrito.items.length === 0">
      Tu carrito está vacío.
    </p>

    <!-- Lista de cursos en el carrito -->
    <ul v-else>
      <li v-for="item in carrito.items" :key="item.id">
        {{ item.curso_titulo }} - ${{ item.curso_precio }} x {{ item.cantidad }}
        <button @click="quitarItem(item.curso)">Quitar</button>
      </li>
    </ul>

    <!-- Total y acciones -->
    <div v-if="carrito && carrito.items.length > 0">
      <p><strong>Total: ${{ carrito.total }}</strong></p>
      <button @click="vaciar">Vaciar carrito</button>
      <button @click="checkout">Comprar ahora</button>
    </div>
  </section>
</template>

<script>
import {
  getCarrito,
  agregarCursoCarrito,
  quitarCursoCarrito,
  vaciarCarrito,
  checkoutCarrito,
} from "@/api/carrito";

import { ref, onMounted } from "vue";

export default {
  setup() {
    const carrito = ref(null);

    // 🔹 Cargar carrito desde API
    const cargarCarrito = async () => {
      try {
        const { data } = await getCarrito();
        carrito.value = data;
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
      }
    };

    // 🔹 Quitar un curso del carrito
    const quitarItem = async (cursoId) => {
      if (!carrito.value) return;
      try {
        await quitarCursoCarrito(carrito.value.id, cursoId);
        await cargarCarrito();
      } catch (error) {
        console.error("Error al quitar curso:", error);
      }
    };

    // 🔹 Vaciar el carrito
    const vaciar = async () => {
      if (!carrito.value) return;
      try {
        await vaciarCarrito(carrito.value.id);
        await cargarCarrito();
      } catch (error) {
        console.error("Error al vaciar carrito:", error);
      }
    };

    // 🔹 Checkout / Comprar
    const checkout = async () => {
      if (!carrito.value) return;
      try {
        await checkoutCarrito(carrito.value.id);
        await cargarCarrito(); // carrito vaciado
        alert("Compra realizada con éxito!");
      } catch (error) {
        console.error("Error al hacer checkout:", error);
      }
    };

    // Cargar carrito al montar el componente
    onMounted(cargarCarrito);

    return {
      carrito,
      quitarItem,
      vaciar,
      checkout,
    };
  },
};
</script>
