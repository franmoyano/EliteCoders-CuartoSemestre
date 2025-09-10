// Clase base para crear personajes
class Personaje {
    constructor(nombre, imagen) {
        this.nombre = nombre;
        this.imagen = imagen;
    }

    // Método para crear el HTML del personaje
    crearElementoHTML() {
        return `
            <div class="opcion-personaje">
                <input type="radio" name="personaje" id="${this.nombre.toLowerCase()}" 
                       value="${this.nombre}" class="selector-personaje" />
                <label for="${this.nombre.toLowerCase()}">${this.nombre}</label>
                <img src="${this.imagen}" alt="${this.nombre}" class="imagen-personaje" />
            </div>
        `;
    }
}

// Clase para manejar todos los personajes del juego
class GestorPersonajes {
    constructor() {
        this.personajes = [];
        this.inicializarPersonajes();
    }

    // Crear todos los personajes iniciales
    inicializarPersonajes() {
        this.personajes = [
            new Personaje("Zuko", "./public/images/zuko.webp"),
            new Personaje("Katara", "./public/images/katara.png"),
            new Personaje("Aang", "./public/images/aang.png"),
            new Personaje("Toph", "./public/images/toph.webp")
        ];
    }

    // Agregar un nuevo personaje
    agregarPersonaje(nombre, imagen) {
        const nuevoPersonaje = new Personaje(nombre, imagen);
        this.personajes.push(nuevoPersonaje);
        this.generarHTMLPersonajes(); // Regenerar la interfaz
        return nuevoPersonaje;
    }

    // Obtener todos los nombres de personajes (para selección aleatoria)
    obtenerNombresPersonajes() {
        return this.personajes.map(personaje => personaje.nombre);
    }

    // Generar HTML dinámicamente
    generarHTMLPersonajes() {
        const contenedor = document.getElementById('seleccionar-personaje');
        if (!contenedor) return;

        const divPersonajes = contenedor.querySelector('div');
        if (divPersonajes) {
            let htmlPersonajes = '';
            this.personajes.forEach(personaje => {
                htmlPersonajes += personaje.crearElementoHTML();
            });
            divPersonajes.innerHTML = htmlPersonajes;

            // Reactivar los event listeners para los nuevos elementos
            this.activarEventListeners();
        }
    }

    // Reactivar event listeners después de regenerar HTML
    activarEventListeners() {
        document.querySelectorAll(".opcion-personaje").forEach((div) => {
            div.addEventListener("click", function () {
                const radio = div.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    radio.dispatchEvent(new Event("change", { bubbles: true }));
                }
            });
        });
    }
}

// Crear instancia del gestor de personajes
const gestorPersonajes = new GestorPersonajes();

const state = {
  ataqueJugador: undefined,
  ataqueEnemigo: undefined,
  vidasJugador: 3,
  vidasEnemigo: 3,
  reglasVisibles: false,
};

const el = {
  botonReglas: null,
  botonJugar: null,
  botonPersonaje: null,
  botonReiniciar: null,
  botonPunio: null,
  botonPatada: null,
  botonBarrida: null,
  seccionReglas: null,
  seccionSeleccionarAtaque: null,
  seccionSeleccionarPersonaje: null,
  spanPersonajeJugador: null,
  spanPersonajeEnemigo: null,
  spanVidasJugador: null,
  spanVidasEnemigo: null,
  mensajePrincipal: null,
};

function inicializarElementos() {
  el.botonReglas = document.getElementById("boton-reglas");
  el.botonJugar = document.getElementById("boton-jugar");
  el.botonPersonaje = document.getElementById("boton-personaje");
  el.botonReiniciar = document.getElementById("boton-reiniciar");
  el.botonPunio = document.getElementById("boton-punio");
  el.botonPatada = document.getElementById("boton-patada");
  el.botonBarrida = document.getElementById("boton-barrida");
  el.seccionReglas = document.getElementById("reglas-del-juego");
  el.seccionSeleccionarAtaque = document.getElementById("seleccionar-ataque");
  el.seccionSeleccionarPersonaje = document.getElementById("seleccionar-personaje");
  el.spanPersonajeJugador = document.getElementById("personaje-jugador");
  el.spanPersonajeEnemigo = document.getElementById("personaje-enemigo");
  el.spanVidasJugador = document.getElementById("vidas-jugador");
  el.spanVidasEnemigo = document.getElementById("vidas-enemigo");
  el.mensajePrincipal = document.getElementById("mensaje-principal");
}

function iniciarJuego() {
  inicializarElementos();

  el.botonReglas.addEventListener("click", mostrarReglas);
  el.botonJugar.addEventListener("click", seleccionarPersonajeJugador);
  el.botonPersonaje.addEventListener("click", seleccionarPersonajeJugador);
  el.botonReiniciar.addEventListener("click", reiniciarJuego);

  el.botonPunio.addEventListener("click", ataquePunio);
  el.botonPatada.addEventListener("click", ataquePatada);
  el.botonBarrida.addEventListener("click", ataqueBarrida);

  establecerEstadoInicial();
}

function establecerEstadoInicial() {
  el.seccionReglas.style.display = "none";
  el.seccionSeleccionarAtaque.style.display = "none";
  el.seccionSeleccionarPersonaje.style.display = "block";
  state.reglasVisibles = false;
  el.botonReiniciar.disabled = true;
  deshabilitarBotonesAtaque();
}

function mostrarReglas() {
  if (state.reglasVisibles) {
    el.seccionReglas.style.display = "none";
    state.reglasVisibles = false;
  } else {
    el.seccionReglas.style.display = "block";
    state.reglasVisibles = true;
  }
}

function seleccionarPersonajeJugador() {
  el.seccionReglas.style.display = "none";
  state.reglasVisibles = false;

  const personajeSeleccionado = document.querySelector('input[name="personaje"]:checked')?.value;

  if (!personajeSeleccionado) {
    alert("Selecciona un personaje");
    return;
  }

  el.spanPersonajeJugador.innerHTML = personajeSeleccionado;
  el.mensajePrincipal.innerHTML = `Seleccionaste al personaje ${personajeSeleccionado}`;

  seleccionarPersonajeEnemigo();

  cambiarEstadoJuegoIniciado();
}

function seleccionarPersonajeEnemigo() {
  const personajes = gestorPersonajes.obtenerNombresPersonajes();
  const personajeAleatorio = personajes[Math.floor(Math.random() * personajes.length)];

  el.spanPersonajeEnemigo.innerHTML = personajeAleatorio;
  el.mensajePrincipal.innerHTML += `<br>El enemigo seleccionó al personaje ${personajeAleatorio}`;
}

function cambiarEstadoJuegoIniciado() {
  el.botonPersonaje.disabled = true;
  el.botonJugar.disabled = true;

  el.botonReiniciar.disabled = false;
  habilitarBotonesAtaque();

  el.seccionSeleccionarAtaque.style.display = "block";
  el.seccionSeleccionarPersonaje.style.display = "none";
}

function ataqueAleatorioEnemigo() {
  const ataqueAleatorio = numeroRandom(1, 3);

  switch (ataqueAleatorio) {
    case 1:
      state.ataqueEnemigo = "Puño";
      break;
    case 2:
      state.ataqueEnemigo = "Patada";
      break;
    case 3:
      state.ataqueEnemigo = "Barrida";
      break;
  }
}

function combatir() {
  let mensaje = "";

  if (state.ataqueJugador === state.ataqueEnemigo) {
    mensaje = "¡Empate! Ambos atacaron con " + state.ataqueJugador;
  } else if (esVictoriaJugador()) {
    state.vidasEnemigo--;
    mensaje = `¡Ganaste! Tu ${state.ataqueJugador} venció al ${state.ataqueEnemigo} del enemigo.`;
  } else {
    state.vidasJugador--;
    mensaje = `¡Perdiste! El ${state.ataqueEnemigo} del enemigo venció a tu ${state.ataqueJugador}.`;
  }

  actualizarInterfaz(mensaje);
  verificarFinDelJuego(mensaje);
}

function esVictoriaJugador() {
  return (
    (state.ataqueJugador === "Puño" && state.ataqueEnemigo === "Barrida") ||
    (state.ataqueJugador === "Patada" && state.ataqueEnemigo === "Puño") ||
    (state.ataqueJugador === "Barrida" && state.ataqueEnemigo === "Patada")
  );
}

function actualizarInterfaz(mensaje) {
  el.mensajePrincipal.innerHTML = mensaje;
  el.spanVidasJugador.innerHTML = state.vidasJugador;
  el.spanVidasEnemigo.innerHTML = state.vidasEnemigo;
}

function verificarFinDelJuego(mensaje) {
  if (state.vidasJugador <= 0 || state.vidasEnemigo <= 0) {
    const resultadoFinal = state.vidasJugador <= 0 ? "¡Perdiste el juego!" : "¡Ganaste el juego!";
    el.mensajePrincipal.innerHTML = `${mensaje}<br><strong>${resultadoFinal}</strong>`;
    deshabilitarBotonesAtaque();
  }
}

function ataquePunio() {
  state.ataqueJugador = "Puño";
  ataqueAleatorioEnemigo();
  combatir();
}

function ataquePatada() {
  state.ataqueJugador = "Patada";
  ataqueAleatorioEnemigo();
  combatir();
}

function ataqueBarrida() {
  state.ataqueJugador = "Barrida";
  ataqueAleatorioEnemigo();
  combatir();
}

function habilitarBotonesAtaque() {
  el.botonPunio.disabled = false;
  el.botonPatada.disabled = false;
  el.botonBarrida.disabled = false;
}

function deshabilitarBotonesAtaque() {
  el.botonPunio.disabled = true;
  el.botonPatada.disabled = true;
  el.botonBarrida.disabled = true;
}

function reiniciarJuego() {
  resetearVariablesJuego();
  limpiarInterfaz();
  desmarcarPersonajes();
  restaurarEstadoBotones();
  mostrarSeccionesIniciales();
}

function resetearVariablesJuego() {
  state.vidasJugador = 3;
  state.vidasEnemigo = 3;
  state.ataqueJugador = undefined;
  state.ataqueEnemigo = undefined;
}

function limpiarInterfaz() {
  el.spanPersonajeJugador.innerHTML = "";
  el.spanPersonajeEnemigo.innerHTML = "";
  el.spanVidasJugador.innerHTML = "3";
  el.spanVidasEnemigo.innerHTML = "3";
  el.mensajePrincipal.innerHTML = "";
}

function desmarcarPersonajes() {
  document.querySelectorAll('input[name="personaje"]').forEach((input) => (input.checked = false));
}

function restaurarEstadoBotones() {
  el.botonPersonaje.disabled = false;
  el.botonJugar.disabled = false;
  el.botonReiniciar.disabled = true;
  deshabilitarBotonesAtaque();
}

function mostrarSeccionesIniciales() {
  el.seccionSeleccionarPersonaje.style.display = "block";
  el.seccionSeleccionarAtaque.style.display = "none";
  el.seccionReglas.style.display = "none";
  state.reglasVisibles = false;
}

function numeroRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Función para agregar personajes fácilmente
function agregarNuevoPersonaje(nombre, rutaImagen) {
  return gestorPersonajes.agregarPersonaje(nombre, rutaImagen);
}

window.addEventListener("load", () => {
  iniciarJuego();
  gestorPersonajes.generarHTMLPersonajes();
  gestorPersonajes.activarEventListeners();
});
