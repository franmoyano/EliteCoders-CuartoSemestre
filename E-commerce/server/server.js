const express = require("express");
const app = express();
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");
const path = require("path");

// Configura el cliente con tu access token
const client = new MercadoPagoConfig({
  accessToken: "<ACCESS_TOKEN>", // REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Sirve los archivos estáticos desde la carpeta client en la ruta /E-commerce/client
app.use("/E-commerce/client", express.static(path.join(__dirname, "../client")));
app.use(cors());

app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname, "../client", "index.html"));
});

app.post("/create_preference", (req, res) => {
  let preferenceData = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
      }
    ],
    back_urls: {
      "success": "http://localhost:8080",
      "failure": "http://localhost:8080",
      "pending": ""
    },
    auto_return: "approved",
  };

  const preference = new Preference(client);
  preference
    .create({ body: preferenceData })
    .then(function (response) {
      res.json({
        id: response.id
      });
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get('/feedback', function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id
  });
});

app.listen(8080, () => {
  console.log("The server is now running on Port 8080");
});