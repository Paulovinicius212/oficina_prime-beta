// src/services/sendPushNotification.js
const fetch = require("node-fetch");

const sendPushNotification = async (token, message) => {
  const FCM_SERVER_KEY = "YOUR_FCM_SERVER_KEY"; // A chave do servidor que você pega no Firebase Console

  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${FCM_SERVER_KEY}`,
    },
    body: JSON.stringify({
      to: token, // O token do dispositivo que você obteve no app
      notification: {
        title: "Novo Problema",
        body: message,
      },
      priority: "high", // Garantir alta prioridade para o envio de notificação
      content_available: true, // Ajuda na entrega imediata de notificações em segundo plano
    }),
  });

  const responseData = await response.json();
  console.log(responseData);
};

// Exemplo de uso - Simulando o token do dispositivo do usuário
const userToken = "USER_DEVICE_TOKEN"; // Token do dispositivo do usuário
sendPushNotification(
  userToken,
  "Novo problema foi postado sobre seu modelo de veículo!"
);
