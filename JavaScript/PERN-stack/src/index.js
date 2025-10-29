import app from './app.js';

const START_PORT = parseInt(process.env.PORT, 10) || 3000;

// Intentamos arrancar en START_PORT; si está ocupado, le pedimos al SO
// que nos asigne un puerto libre (usando 0) y lo mostramos.
function startServer(port = START_PORT) {
	const server = app.listen(port, () => {
		// Si pedimos puerto 0, el SO asigna uno y lo recuperamos via server.address().port
		const actualPort = server.address() && server.address().port;
		console.log(`Servidor levantado en el puerto ${actualPort} (pid ${process.pid}).`);
	});

	server.on('error', (err) => {
		if (err && err.code === 'EADDRINUSE') {
			if (port === 0) {
				console.error('El SO me devolvió un puerto pero igual está ocupado.');
				process.exit(1);
			}
			console.warn(`El puerto ${port} ya está ocupado. Le pido al sistema que me asigne uno libre...`);
			// Pedimos al SO un puerto libre
			startServer(0);
			return;
		}
		console.error('Error del servidor:', err);
		process.exit(1);
	});

	// Por si queremos hacer algo al cerrar
	process.on('SIGINT', () => {
		console.log('\nCierro el servidor. Chau!');
		server.close(() => process.exit(0));
	});
}

startServer();