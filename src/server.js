// src/server.js
const express = require("express");
const bodyParser = require("body-parser");
const { sendPushNotification } = require("./services/sendPushNotification");
const app = express();
const port = 3000;

let deviceTokens = []; // Array simples para armazenar os tokens

app.use(bodyParser.json());

// Endpoint para receber o token do dispositivo
app.post("/registerToken", (req, res) => {
  const { token } = req.body;

  if (token) {
    deviceTokens.push(token); // Armazena o token (no caso de exemplo em um array)
    res.status(200).send("Token registrado com sucesso");
  } else {
    res.status(400).send("Token não fornecido");
  }
});

// Endpoint para enviar notificações a todos os dispositivos registrados
app.post("/sendNotification", (req, res) => {
  const { message } = req.body;

  deviceTokens.forEach((token) => {
    sendPushNotification(token, message); // Envia a notificação para todos os tokens
  });

  res.status(200).send("Notificação enviada com sucesso");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
