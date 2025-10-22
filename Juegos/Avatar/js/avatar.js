// Clase que representa a un personaje individual
class Personaje {
    constructor(nombre, imagen) {
        this.nombre = nombre;
        this.imagen = imagen;
    }

    // Crea el HTML para mostrar el personaje en la selección
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

// Clase que gestiona todos los personajes del juego
class GestorPersonajes {
    constructor() {
        // Detecta automáticamente la ruta base donde está el archivo avatar.html
        this.basePath = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}/public/images/`;

        // Inicializamos el array y cargamos los personajes base
        this.personajes = [];
        this.inicializarPersonajes();
    }

    // Inicializa los personajes base del juego
    inicializarPersonajes() {
        this.personajes = [
            new Personaje("Zuko", `${this.basePath}zuko.webp`),
            new Personaje("Katara", `${this.basePath}katara.png`),
            new Personaje("Aang", `${this.basePath}aang.png`),
            new Personaje("Toph", `${this.basePath}toph.webp`)
        ];
    }

    // Permite agregar un nuevo personaje usando POO
    agregarPersonaje(nombre, imagen) {
        const nuevoPersonaje = new Personaje(nombre, imagen);
        this.personajes.push(nuevoPersonaje);
        this.generarHTMLPersonajes(); // Actualiza la interfaz
        return nuevoPersonaje;
    }

    // Devuelve los nombres de todos los personajes (para elegir aleatoriamente)
    obtenerNombresPersonajes() {
        return this.personajes.map(personaje => personaje.nombre);
    }

    // Genera el HTML de todos los personajes y lo pone en la página
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
            this.activarEventListeners();
        }
    }

    // Vuelve a activar los listeners para seleccionar personajes
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

// Instanciamos el gestor de personajes
const gestorPersonajes = new GestorPersonajes();

// Clase principal que maneja todo el juego
class Juego {
    constructor(gestorPersonajes) {
        // Guardamos el gestor de personajes para usarlo en el juego
        this.gestorPersonajes = gestorPersonajes;
        // Estado del juego
        this.vidasJugador = 3;
        this.vidasEnemigo = 3;
        this.personajeJugador = null;
        this.personajeEnemigo = null;
        this.ataqueJugador = null;
        this.ataqueEnemigo = null;
        this.reglasVisibles = false;
        // Inicializamos los elementos del DOM
        this.inicializarElementos();
        // Ponemos los listeners a los botones
        this.inicializarEventos();
        // Estado inicial de la interfaz
        this.establecerEstadoInicial();
    }

    // Busca y guarda los elementos del HTML que vamos a usar
    inicializarElementos() {
        this.el = {
            botonReglas: document.getElementById("boton-reglas"),
            botonJugar: document.getElementById("boton-jugar"),
            botonPersonaje: document.getElementById("boton-personaje"),
            botonReiniciar: document.getElementById("boton-reiniciar"),
            botonPunio: document.getElementById("boton-punio"),
            botonPatada: document.getElementById("boton-patada"),
            botonBarrida: document.getElementById("boton-barrida"),
            seccionReglas: document.getElementById("reglas-del-juego"),
            seccionSeleccionarAtaque: document.getElementById("seleccionar-ataque"),
            seccionSeleccionarPersonaje: document.getElementById("seleccionar-personaje"),
            spanPersonajeJugador: document.getElementById("personaje-jugador"),
            spanPersonajeEnemigo: document.getElementById("personaje-enemigo"),
            spanVidasJugador: document.getElementById("vidas-jugador"),
            spanVidasEnemigo: document.getElementById("vidas-enemigo"),
            mensajePrincipal: document.getElementById("mensaje-principal"),
        };
    }

    // Agrega los listeners a los botones principales
    inicializarEventos() {
        this.el.botonReglas.addEventListener("click", () => this.mostrarReglas());
        this.el.botonJugar.addEventListener("click", () => this.seleccionarPersonajeJugador());
        this.el.botonPersonaje.addEventListener("click", () => this.seleccionarPersonajeJugador());
        this.el.botonReiniciar.addEventListener("click", () => this.reiniciarJuego());
        this.el.botonPunio.addEventListener("click", () => this.ataque("Puño"));
        this.el.botonPatada.addEventListener("click", () => this.ataque("Patada"));
        this.el.botonBarrida.addEventListener("click", () => this.ataque("Barrida"));
    }

    // Deja la interfaz lista para empezar una partida nueva
    establecerEstadoInicial() {
        this.el.seccionReglas.style.display = "none";
        this.el.seccionSeleccionarAtaque.style.display = "none";
        this.el.seccionSeleccionarPersonaje.style.display = "block";
        this.el.botonReiniciar.disabled = true;
        this.deshabilitarBotonesAtaque();
        this.vidasJugador = 3;
        this.vidasEnemigo = 3;
        this.actualizarVidas();
        this.el.mensajePrincipal.innerHTML = "";
    }

    // Muestra u oculta las reglas del juego
    mostrarReglas() {
        this.reglasVisibles = !this.reglasVisibles;
        this.el.seccionReglas.style.display = this.reglasVisibles ? "block" : "none";
    }

    // Cuando el jugador selecciona su personaje
    seleccionarPersonajeJugador() {
        this.el.seccionReglas.style.display = "none";
        this.reglasVisibles = false;
        const personajeSeleccionado = document.querySelector('input[name="personaje"]:checked')?.value;
        if (!personajeSeleccionado) {
            alert("Selecciona un personaje");
            return;
        }
        this.personajeJugador = personajeSeleccionado;
        this.el.spanPersonajeJugador.innerHTML = personajeSeleccionado;
        this.el.mensajePrincipal.innerHTML = `Seleccionaste al personaje ${personajeSeleccionado}`;
        this.seleccionarPersonajeEnemigo();
        this.cambiarEstadoJuegoIniciado();
    }

    // Elige aleatoriamente el personaje enemigo
    seleccionarPersonajeEnemigo() {
        const personajes = this.gestorPersonajes.obtenerNombresPersonajes();
        const personajeAleatorio = personajes[Math.floor(Math.random() * personajes.length)];
        this.personajeEnemigo = personajeAleatorio;
        this.el.spanPersonajeEnemigo.innerHTML = personajeAleatorio;
        this.el.mensajePrincipal.innerHTML += `<br>El enemigo seleccionó al personaje ${personajeAleatorio}`;
    }

    // Cambia la interfaz para que el jugador pueda atacar
    cambiarEstadoJuegoIniciado() {
        this.el.botonPersonaje.disabled = true;
        this.el.botonJugar.disabled = true;
        this.el.botonReiniciar.disabled = false;
        this.habilitarBotonesAtaque();
        this.el.seccionSeleccionarAtaque.style.display = "block";
        this.el.seccionSeleccionarPersonaje.style.display = "none";
    }

    // Cuando el jugador elige un ataque
    ataque(tipo) {
        this.ataqueJugador = tipo;
        this.ataqueEnemigo = this.ataqueAleatorioEnemigo();
        this.combatir();
    }

    // Elige aleatoriamente el ataque del enemigo
    ataqueAleatorioEnemigo() {
        const ataques = ["Puño", "Patada", "Barrida"];
        return ataques[Math.floor(Math.random() * ataques.length)];
    }

    // Lógica para decidir quién gana el combate
    combatir() {
        let mensaje = "";
        if (this.ataqueJugador === this.ataqueEnemigo) {
            mensaje = "¡Empate! Ambos atacaron con " + this.ataqueJugador;
        } else if (this.esVictoriaJugador()) {
            this.vidasEnemigo--;
            mensaje = `¡Ganaste! Tu ${this.ataqueJugador} venció al ${this.ataqueEnemigo} del enemigo.`;
        } else {
            this.vidasJugador--;
            mensaje = `¡Perdiste! El ${this.ataqueEnemigo} del enemigo venció a tu ${this.ataqueJugador}.`;
        }
        this.actualizarInterfaz(mensaje);
        this.verificarFinDelJuego(mensaje);
    }

    // Devuelve true si el jugador gana la ronda
    esVictoriaJugador() {
        return (
            (this.ataqueJugador === "Puño" && this.ataqueEnemigo === "Barrida") ||
            (this.ataqueJugador === "Patada" && this.ataqueEnemigo === "Puño") ||
            (this.ataqueJugador === "Barrida" && this.ataqueEnemigo === "Patada")
        );
    }

    // Actualiza los mensajes y las vidas en la interfaz
    actualizarInterfaz(mensaje) {
        this.el.mensajePrincipal.innerHTML = mensaje;
        this.actualizarVidas();
    }

    // Refresca los contadores de vidas
    actualizarVidas() {
        this.el.spanVidasJugador.innerHTML = this.vidasJugador;
        this.el.spanVidasEnemigo.innerHTML = this.vidasEnemigo;
    }

    // Si alguien se queda sin vidas, termina el juego
    verificarFinDelJuego(mensaje) {
        if (this.vidasJugador <= 0 || this.vidasEnemigo <= 0) {
            const resultadoFinal = this.vidasJugador <= 0 ? "¡Perdiste el juego!" : "¡Ganaste el juego!";
            this.el.mensajePrincipal.innerHTML = `${mensaje}<br><strong>${resultadoFinal}</strong>`;
            this.deshabilitarBotonesAtaque();
        }
    }

    // Activa los botones de ataque
    habilitarBotonesAtaque() {
        this.el.botonPunio.disabled = false;
        this.el.botonPatada.disabled = false;
        this.el.botonBarrida.disabled = false;
    }

    // Desactiva los botones de ataque
    deshabilitarBotonesAtaque() {
        this.el.botonPunio.disabled = true;
        this.el.botonPatada.disabled = true;
        this.el.botonBarrida.disabled = true;
    }

    // Deja todo listo para volver a jugar
    reiniciarJuego() {
        this.vidasJugador = 3;
        this.vidasEnemigo = 3;
        this.ataqueJugador = null;
        this.ataqueEnemigo = null;
        this.personajeJugador = null;
        this.personajeEnemigo = null;
        this.el.spanPersonajeJugador.innerHTML = "";
        this.el.spanPersonajeEnemigo.innerHTML = "";
        this.el.mensajePrincipal.innerHTML = "";
        this.actualizarVidas();
        document.querySelectorAll('input[name="personaje"]').forEach((input) => (input.checked = false));
        this.el.botonPersonaje.disabled = false;
        this.el.botonJugar.disabled = false;
        this.el.botonReiniciar.disabled = true;
        this.deshabilitarBotonesAtaque();
        this.el.seccionSeleccionarPersonaje.style.display = "block";
        this.el.seccionSeleccionarAtaque.style.display = "none";
        this.el.seccionReglas.style.display = "none";
        this.reglasVisibles = false;
    }
}

// Función para agregar personajes desde fuera usando POO
function agregarNuevoPersonaje(nombre, rutaImagen) {
    return gestorPersonajes.agregarPersonaje(nombre, rutaImagen);
}

// Cuando la página carga, generamos los personajes y arrancamos el juego
window.addEventListener("load", () => {
    gestorPersonajes.generarHTMLPersonajes();
    gestorPersonajes.activarEventListeners();
    new Juego(gestorPersonajes);

    // --- Lógica para mostrar/ocultar el formulario de agregar personaje ---
    const toggleFormBtn = document.getElementById("toggle-form-nuevo-personaje");
    const formNuevoPersonaje = document.getElementById("form-nuevo-personaje");
    if (toggleFormBtn && formNuevoPersonaje) {
        toggleFormBtn.addEventListener("click", function () {
            if (formNuevoPersonaje.style.display === "none" || formNuevoPersonaje.style.display === "") {
                formNuevoPersonaje.style.display = "flex";
            } else {
                formNuevoPersonaje.style.display = "none";
            }
        });
    }

    // --- Lógica para agregar un nuevo personaje desde el formulario simplificado ---
if (formNuevoPersonaje) {
    // Construimos la ruta base automáticamente
    const basePath = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}/public/images/`;

    // Diccionario de imágenes disponibles con ruta dinámica
    const imagenesPorNombre = {
        "Zuko": `${basePath}zuko.webp`,
        "Katara": `${basePath}katara.png`,
        "Aang": `${basePath}aang.png`,
        "Toph": `${basePath}toph.webp`,
        "Sokka": `${basePath}sokka.webp`
    };

    formNuevoPersonaje.addEventListener("submit", function (e) {
        e.preventDefault();
        const selectNombre = document.getElementById("select-nombre-personaje");
        const nombre = selectNombre.value;

        if (!nombre || !imagenesPorNombre[nombre]) {
            alert("Selecciona un personaje válido.");
            return;
        }

        // Validación: ¿ya existe el personaje en la interfaz?
        const nombresActuales = gestorPersonajes.obtenerNombresPersonajes().map(n => n.toLowerCase());
        if (nombresActuales.includes(nombre.toLowerCase())) {
            alert("Este personaje ya se encuentra desbloqueado.");
            return;
        }

        // Usamos la función POO para agregar el personaje con la imagen correspondiente
        agregarNuevoPersonaje(nombre, imagenesPorNombre[nombre]);

        // Limpiamos el formulario
        selectNombre.value = "";
        formNuevoPersonaje.style.display = "none";
    });
}
});