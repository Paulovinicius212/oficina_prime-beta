// src/services/sendTokenToBackend.js
const sendTokenToBackend = async (token) => {
  try {
    const response = await fetch("https://seu-backend.com/registerToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token, // Envia o token do dispositivo para o backend
      }),
    });

    if (response.ok) {
      console.log("Token enviado com sucesso!");
    } else {
      console.error("Falha ao enviar token");
    }
  } catch (error) {
    console.error("Erro ao enviar token ao backend:", error);
  }
};
