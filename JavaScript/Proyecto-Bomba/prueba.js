var theCount;
var alarm  = document.getElementById("alarm");
var alarm2 = document.getElementById("alarm2");

var panel      = document.getElementById("panel");
// En HTML el id es "turn--off" (dos guiones)
var turnoff    = document.getElementById("turn--off");
var turnOffHor = document.getElementById("closing");
var detonate   = document.getElementById("detonate");
alarm.volume = 0.50;

var time = document.getElementById("time");

// util: garantiza que se pueda saltar a un segundo específico
function playFrom(audio, seconds) {
  // si aún no tiene metadatos, espera a poder hacer seek
  if (audio.readyState < 1) {
    audio.addEventListener("loadedmetadata", function onMeta() {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.currentTime = Math.min(seconds, audio.duration || seconds);
      audio.play();
    });
    audio.load();
  } else {
    audio.currentTime = Math.min(seconds, audio.duration || seconds);
    audio.play();
  }
}

function showCountDown() {
  time.innerText = time.innerText - 1;

  // aquí decía "TimeRanges.innerText"; debe ser "time"
  if (time.innerText == 0) {
    clearInterval(theCount);
    time.classList.add("crono");
    abort.classList.add("hide");
    detonate.classList.add("show");

    setTimeout(function () {
      turnoff.classList.add("close");
      turnOffHor.classList.add("close");
      reload.classList.add("show");

      // al terminar la cuenta, pausa alarma y reproduce explosión
      alarm.pause();
      alarm.currentTime = 0;
      alarm2.currentTime = 0;
      alarm2.play();
    }, 1500);
  }
}

var cover = document.getElementById("cover");
cover.addEventListener("click", function () {
  if (this.className == "box") this.classList.add("opened");
  else this.classList.remove("opened");
});

var btn = document.getElementById("activate");
// aquí ponía "activate.addEventListener"; debe ser "btn"
btn.addEventListener("click", function () {
  this.classList.add("pushed");

  // reproducimos alarma desde 10.1s de forma confiable
  playFrom(alarm, 10.1);

  setTimeout(function () {
    panel.classList.add("show");
    theCount = setInterval(showCountDown, 1000);

    // vuelve a reproducir la alarma (desde inicio o donde esté)
    if (alarm.paused) alarm.play();
  }, 500);
});

var abort = document.getElementById("abort");
abort.addEventListener("click", function () {
  btn.classList.remove("pushed");
  panel.classList.remove("show");
  clearInterval(theCount);
  time.innerText = 9;

  alarm.pause();
  alarm.currentTime = 10; // dejar lista la cola en 10s
  alarm.load();

  // por si la explosión estaba sonando, la detenemos
  alarm2.pause();
  alarm2.currentTime = 0;
});

var reload = document.getElementById("restart");
reload.addEventListener("click", function () {
  panel.classList.remove("show");
  turnoff.classList.remove("close");
  turnOffHor.classList.remove("close");
  abort.classList.remove("hide");
  detonate.classList.remove("show");
  cover.classList.remove("opened");
  btn.classList.remove("pushed");
  this.classList.remove("show");
  time.classList.remove("crono");
  time.innerText = 9;

  alarm.pause();
  alarm.currentTime = 0;
  alarm2.pause();
  alarm2.currentTime = 0;
});

setTimeout(function () {
  cover.classList.remove("opened");
}, 100);

var mute = document.getElementById("mute");
mute.addEventListener("click", function () {
  if (this.classList.contains("muted")) {
    alarm.muted = false;
    alarm2.muted = false;
    this.classList.remove("muted");
  } else {
    alarm.muted = true;
    alarm2.muted = true;
    this.classList.add("muted");
  }
});
