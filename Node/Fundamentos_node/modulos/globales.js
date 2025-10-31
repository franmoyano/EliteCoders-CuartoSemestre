// this == global = true

// mostrar algo en consola
//console.log("Hola desde un módulo global");

// mostrar un mensaje en forma de error
//console.error("Este es un mensaje de error desde un módulo global");

// ejecutar un código después de un intervalo de tiempo
//setTimeout(() => {});

// ejecutar un código de forma repetida cada cierto intervalo de tiempo
//setInterval(() => {});

// da prioridad de ejecución a una función asincrona
//setImmediate(() => {});

//console.log(setInterval);


let i = 0;
let intervalo = setInterval(() => {
    console.log("Hola");
    if (i === 3) {
        clearInterval(intervalo); // detenemos la función
    }
    i++;
}, 1000)

setImmediate(() => {
    console.log("Hola en inmediato");
});

// require(); xporta modulos

console.log(__dirname); // ruta absoluta del directorio donde se encuentra el archivo
console.log(__filename); // ruta absoluta del archivo actual

globalThis.miVariable = "El valor de mi variable global";
console.log(miVariable);





