function hola(nombre) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      console.log('Hola ' + nombre);
      resolve(nombre);
    }, 1000);
  });
}

function hablar(nombre) {
  return new Promise((resolve, reject) => { // usamos la sintaxis de arrow function
    setTimeout(function () {
      console.log('bla bla bla');
      resolve(nombre);
    }, 1000);
  });
}

function adios(nombre) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      // validamos el error o aprobación
      console.log('Adios ' + nombre);
      // if(err) reject('Hay un error');
      resolve();
    }, 1000);
  });
}