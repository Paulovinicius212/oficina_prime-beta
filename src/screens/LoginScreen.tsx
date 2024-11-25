import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground, // Importando ImageBackground
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await AsyncStorage.setItem("user", JSON.stringify(userCredential.user)); // Salva o usuário autenticado
      navigation.navigate("Home"); // Navega para a Home após login
    } catch (error: any) {
      const errorMessage =
        error.code === "auth/user-not-found"
          ? "Usuário não encontrado. Verifique seu e-mail."
          : error.code === "auth/wrong-password"
          ? "Senha incorreta."
          : "Erro ao realizar login.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Usando ImageBackground para definir o fundo com uma URL
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/fotos-premium/mecanico-em-cena-mecanico-a-trabalhar-no-carro_923558-3711.jpg?w=2000",
      }} // URL da imagem
      style={styles.background} // Estilo da imagem de fundo
      resizeMode='cover' // Garante que a imagem cubra toda a tela sem distorcer
    >
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          placeholder='Senha'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title='Entrar' onPress={handleLogin} disabled={loading} />
        {loading && (
          <ActivityIndicator
            size='large'
            color='#0000ff'
            style={styles.loader}
          />
        )}
        <Button
          title='Criar conta'
          onPress={() => navigation.navigate("Register")}
          color='#4CAF50'
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // Estilo para o ImageBackground, cobrindo toda a tela
  background: {
    flex: 1, // Garante que o ImageBackground ocupe toda a tela
    justifyContent: "center", // Alinha o conteúdo verticalmente no centro
    alignItems: "center", // Alinha o conteúdo horizontalmente no centro
    width: "100%", // Garante que ocupe toda a largura da tela
    height: "100%", // Garante que ocupe toda a altura da tela
  },
  container: {
    flex: 0.6, // Ajuste a altura do container para 60% da tela, assim o login ficará em destaque
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Cor de fundo semi-transparente para dar contraste
    borderRadius: 8, // Pode dar arredondamento ao container
    width: "80%", // Ajuste a largura do container para deixar mais centralizado
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  loader: {
    marginTop: 16,
  },
});

export default LoginScreen;
