import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


// Creando nueva aplicación de express
const app = express();

// Configuracion de aplicacion
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Configuración para servir archivos estáticos del frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para loguear todas las peticiones
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(express.static(path.resolve(__dirname, '../client')));

// Ruta para servir index.html en cualquier ruta no API
app.get(/^(?!\/(create_preference|ping|api)).*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
});


// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-2252390570888624-091016-0764c5908b43b2003802652d1ab1cfb3-2670385886' });



// Rutas de Ping
app.get('/ping', (req, res) => {
    res.send('pong');
});

// Ruta de Creacion de Preferencia mp
app.post('/create_preference', async (req, res) => {
    const preference = new Preference(client);

    preference.create({
        body: {
            items: [
                {
                    title: 'Mi producto',
                    quantity: 1,
                    unit_price: 2000
                }
            ],
            // Configuracion de redireccionamiento
            back_urls: {
                success: "https://www.tu-sitio/success",
                failure: "https://www.tu-sitio/failure",
                pending: " "
            },
            auto_return: "approved",
        }
    })
        .then((data) => {
            console.log(data);
            res.status(200).json({
                preference_id: data.id,
                preference_url: data.init_point,
            });
        })
        .catch(() => {
            res.status(500).json({ error: 'Ocurrió un error al crear la preferencia' });
        });

});


// Configuracion del puerto
app.listen(8080, () => {
    console.log('The server is now running on Port 8080');
});

