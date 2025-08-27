let ataqueJugador;
let ataqueEnemigo;
let vidasJugador = 3;
let vidasEnemigo = 3;
let reglasVisibles = false;

let botonReglas;
let botonJugar;
let botonPersonaje;
let botonReiniciar;
let botonPunio;
let botonPatada;
let botonBarrida;
let seccionReglas;
let seccionSeleccionarAtaque;
let seccionSeleccionarPersonaje;
let spanPersonajeJugador;
let spanPersonajeEnemigo;
let spanVidasJugador;
let spanVidasEnemigo;
let mensajePrincipal;

function inicializarElementos() {
  botonReglas = document.getElementById("boton-reglas");
  botonJugar = document.getElementById("boton-jugar");
  botonPersonaje = document.getElementById("boton-personaje");
  botonReiniciar = document.getElementById("boton-reiniciar");
  botonPunio = document.getElementById("boton-punio");
  botonPatada = document.getElementById("boton-patada");
  botonBarrida = document.getElementById("boton-barrida");
  seccionReglas = document.getElementById("reglas-del-juego");
  seccionSeleccionarAtaque = document.getElementById("seleccionar-ataque");
  seccionSeleccionarPersonaje = document.getElementById(
    "seleccionar-personaje"
  );
  spanPersonajeJugador = document.getElementById("personaje-jugador");
  spanPersonajeEnemigo = document.getElementById("personaje-enemigo");
  spanVidasJugador = document.getElementById("vidas-jugador");
  spanVidasEnemigo = document.getElementById("vidas-enemigo");
  mensajePrincipal = document.getElementById("mensaje-principal");
}

function iniciarJuego() {
  inicializarElementos();

  botonReglas.addEventListener("click", mostrarReglas);
  botonJugar.addEventListener("click", seleccionarPersonajeJugador);
  botonPersonaje.addEventListener("click", seleccionarPersonajeJugador);
  botonReiniciar.addEventListener("click", reiniciarJuego);

  botonPunio.addEventListener("click", ataquePunio);
  botonPatada.addEventListener("click", ataquePatada);
  botonBarrida.addEventListener("click", ataqueBarrida);

  establecerEstadoInicial();
}

function establecerEstadoInicial() {
  seccionReglas.style.display = "none";
  seccionSeleccionarAtaque.style.display = "none";
  seccionSeleccionarPersonaje.style.display = "block";
  reglasVisibles = false;
  botonReiniciar.disabled = true;
  deshabilitarBotonesAtaque();
}

function mostrarReglas() {
  if (reglasVisibles) {
    seccionReglas.style.display = "none";
    reglasVisibles = false;
  } else {
    seccionReglas.style.display = "block";
    reglasVisibles = true;
  }
}

function seleccionarPersonajeJugador() {
  seccionReglas.style.display = "none";
  reglasVisibles = false;

  let personajeSeleccionado = document.querySelector(
    'input[name="personaje"]:checked'
  )?.value;

  if (!personajeSeleccionado) {
    alert("Selecciona un personaje");
    return;
  }

  spanPersonajeJugador.innerHTML = personajeSeleccionado;
  mensajePrincipal.innerHTML = `Seleccionaste al personaje ${personajeSeleccionado}`;

  seleccionarPersonajeEnemigo();

  cambiarEstadoJuegoIniciado();
}

function seleccionarPersonajeEnemigo() {
  const personajes = ["Zuko", "Katara", "Aang", "Toph"];
  const personajeAleatorio =
    personajes[Math.floor(Math.random() * personajes.length)];

  spanPersonajeEnemigo.innerHTML = personajeAleatorio;
  mensajePrincipal.innerHTML += `<br>El enemigo seleccionó al personaje ${personajeAleatorio}`;
}

function cambiarEstadoJuegoIniciado() {
  botonPersonaje.disabled = true;
  botonJugar.disabled = true;

  botonReiniciar.disabled = false;
  habilitarBotonesAtaque();

  seccionSeleccionarAtaque.style.display = "block";
  seccionSeleccionarPersonaje.style.display = "none";
}

function ataqueAleatorioEnemigo() {
  let ataqueAleatorio = numeroRandom(1, 3);

  switch (ataqueAleatorio) {
    case 1:
      ataqueEnemigo = "Puño";
      break;
    case 2:
      ataqueEnemigo = "Patada";
      break;
    case 3:
      ataqueEnemigo = "Barrida";
      break;
  }
}

function combatir() {
  let mensaje = "";

  if (ataqueJugador === ataqueEnemigo) {
    mensaje = "¡Empate! Ambos atacaron con " + ataqueJugador;
  } else if (esVictoriaJugador()) {
    vidasEnemigo--;
    mensaje = `¡Ganaste! Tu ${ataqueJugador} venció al ${ataqueEnemigo} del enemigo.`;
  } else {
    vidasJugador--;
    mensaje = `¡Perdiste! El ${ataqueEnemigo} del enemigo venció a tu ${ataqueJugador}.`;
  }

  actualizarInterfaz(mensaje);

  verificarFinDelJuego(mensaje);
}

function esVictoriaJugador() {
  return (
    (ataqueJugador === "Puño" && ataqueEnemigo === "Barrida") ||
    (ataqueJugador === "Patada" && ataqueEnemigo === "Puño") ||
    (ataqueJugador === "Barrida" && ataqueEnemigo === "Patada")
  );
}

function actualizarInterfaz(mensaje) {
  mensajePrincipal.innerHTML = mensaje;
  spanVidasJugador.innerHTML = vidasJugador;
  spanVidasEnemigo.innerHTML = vidasEnemigo;
}

function verificarFinDelJuego(mensaje) {
  if (vidasJugador <= 0 || vidasEnemigo <= 0) {
    let resultadoFinal =
      vidasJugador <= 0 ? "¡Perdiste el juego!" : "¡Ganaste el juego!";
    mensajePrincipal.innerHTML = `${mensaje}<br><strong>${resultadoFinal}</strong>`;
    deshabilitarBotonesAtaque();
  }
}

function ataquePunio() {
  ataqueJugador = "Puño";
  ataqueAleatorioEnemigo();
  combatir();
}

function ataquePatada() {
  ataqueJugador = "Patada";
  ataqueAleatorioEnemigo();
  combatir();
}

function ataqueBarrida() {
  ataqueJugador = "Barrida";
  ataqueAleatorioEnemigo();
  combatir();
}

function habilitarBotonesAtaque() {
  botonPunio.disabled = false;
  botonPatada.disabled = false;
  botonBarrida.disabled = false;
}

function deshabilitarBotonesAtaque() {
  botonPunio.disabled = true;
  botonPatada.disabled = true;
  botonBarrida.disabled = true;
}

function reiniciarJuego() {
  resetearVariablesJuego();
  limpiarInterfaz();
  desmarcarPersonajes();
  restaurarEstadoBotones();
  mostrarSeccionesIniciales();
}

function resetearVariablesJuego() {
  vidasJugador = 3;
  vidasEnemigo = 3;
  ataqueJugador = undefined;
  ataqueEnemigo = undefined;
}

function limpiarInterfaz() {
  spanPersonajeJugador.innerHTML = "";
  spanPersonajeEnemigo.innerHTML = "";
  spanVidasJugador.innerHTML = "3";
  spanVidasEnemigo.innerHTML = "3";
  mensajePrincipal.innerHTML = "";
}

function desmarcarPersonajes() {
  document
    .querySelectorAll('input[name="personaje"]')
    .forEach((input) => (input.checked = false));
}

function restaurarEstadoBotones() {
  botonPersonaje.disabled = false;
  botonJugar.disabled = false;
  botonReiniciar.disabled = true;
  deshabilitarBotonesAtaque();
}

function mostrarSeccionesIniciales() {
  seccionSeleccionarPersonaje.style.display = "block";
  seccionSeleccionarAtaque.style.display = "none";
  seccionReglas.style.display = "none";
  reglasVisibles = false;
}

function numeroRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener("load", () => {
  iniciarJuego();
  // Permite seleccionar el radio al hacer click en el div .opcion-personaje
  document.querySelectorAll('.opcion-personaje').forEach(div => {
    div.addEventListener('click', function(e) {
      const radio = div.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });
});