import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground, // Importando ImageBackground
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carregamento

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Erro", "Por favor, insira um email válido.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true); // Inicia o carregamento

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await AsyncStorage.setItem("user", JSON.stringify(userCredential.user)); // Salva o usuário autenticado
      Alert.alert("Sucesso", "Conta criada!");
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false); // Finaliza o carregamento
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
        <Text style={styles.title}>Registro</Text>
        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
        />
        <TextInput
          style={styles.input}
          placeholder='Senha'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {loading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : (
          <Button title='Registrar' onPress={handleRegister} />
        )}
        <Button
          title='Voltar ao Login'
          onPress={() => navigation.navigate("Login")}
        />
      </View>
    </ImageBackground>
  );
}

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
    flex: 0.6, // Ajuste a altura do container para 60% da tela, assim o formulário de registro ficará em destaque
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Cor de fundo semi-transparente para dar contraste
    borderRadius: 8, // Pode dar arredondamento ao container
    width: "80%", // Ajuste a largura do container para deixar mais centralizado
  },
  title: { fontSize: 24, marginBottom: 20, color: "#fff" }, // Cor da fonte para visibilidade
  input: {
    width: "80%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});
