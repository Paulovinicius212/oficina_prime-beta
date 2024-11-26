// src/NotificationSetup.js ou App.js
import React, { useEffect } from "react";
import { Alert } from "react-native";
import messaging from "@react-native-firebase/messaging";

// Solicitar permissão para notificações e obter o token FCM
const requestUserPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const isEnabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (isEnabled) {
      const fcmToken = await messaging().getToken();
      console.log("FCM Token:", fcmToken); // Esse token será enviado para o backend para notificações
      // Você pode agora enviar o token ao seu backend
    } else {
      console.log("Permissão negada para notificações");
    }
  } catch (error) {
    console.error("Erro ao solicitar permissão para notificações:", error);
  }
};

// Configuração de listener para notificações em segundo plano
const setupNotificationListener = () => {
  messaging().onMessage(async (remoteMessage) => {
    Alert.alert("Nova Notificação!", remoteMessage.notification.body);
  });
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Mensagem recebida em segundo plano:", remoteMessage);
  });
};

// Executando as funções na inicialização
useEffect(() => {
  requestUserPermission();
  setupNotificationListener();
}, []);
