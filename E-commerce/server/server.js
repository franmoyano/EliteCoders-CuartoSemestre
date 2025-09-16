import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

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

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

// Rutas de Ping
app.get('/ping', (req, res) => {
    res.send('pong');
});

// Ruta de Creacion de Preferencia mp
app.post('/create_preference', async (req, res) => {
    const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : 'https://localhost:8080';
    console.log(baseUrl)
    const preference = new Preference(client);
    const items = req.body.items;

    preference.create({
        body: {
            items,
            // Configuracion de redireccionamiento
            back_urls: {
                success: `${baseUrl}/success`,
                failure: `${baseUrl}/failure`,
                pending: ""
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
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: 'Ocurrió un error al crear la preferencia' });
        });

});



app.get('/success', (req, res) => {
    console.log("Query Params de Success:", req.query);
    res.redirect(`/${req.query.status === 'approved' ? 'success.html' : 'failure.html'}`);
});

app.get('/failure', (req, res) => {
    res.redirect('/failure.html');
});


// Esta es tu ruta "comodín" o "catch-all"
app.get(/^(?!\/(create_preference|ping|api)).*/, (req, res) => {
    res.redirect('/index.html');
});

// Configuracion del puerto
app.listen(8080, () => {
    console.log('The server is now running on Port 8080');
});