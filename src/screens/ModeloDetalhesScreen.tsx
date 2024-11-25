import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { db, auth } from "../services/firebase";
import { updateDoc, doc, Timestamp } from "firebase/firestore";

export default function ModeloDetalhesScreen({ route, navigation }: any) {
  const { modelDetails } = route.params; // Dados do modelo passado pela tela anterior
  const [pros, setPros] = useState<string>(modelDetails.pros.join(", "));
  const [contras, setContras] = useState<string>(
    modelDetails.contras.join(", ")
  );
  const [loading, setLoading] = useState<boolean>(false); // Controle de carregamento

  const backgroundImageUrl =
    "https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"; // Substitua pela URL desejada

  useEffect(() => {
    // Verificar se o usuário é o autor do problema
    if (modelDetails.userId !== auth.currentUser?.uid) {
      Alert.alert(
        "Acesso Negado",
        "Você não tem permissão para editar essas informações."
      );
      navigation.goBack(); // Volta para a tela anterior
    }
  }, [modelDetails, navigation]);

  const handleUpdateDetails = async () => {
    if (!pros || !contras) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true); // Inicia o carregamento
    const problemRef = doc(db, "problemas", modelDetails.id); // Referência ao problema no Firestore

    try {
      await updateDoc(problemRef, {
        pros: pros.split(", "), // Salvando os prós como um array
        contras: contras.split(", "), // Salvando os contras como um array
        dataCriacao: Timestamp.now(),
      });

      Alert.alert("Sucesso", "Informações atualizadas!");
      navigation.goBack(); // Voltar para a tela anterior
    } catch (error) {
      console.error("Erro ao atualizar detalhes:", error);
      Alert.alert("Erro", "Não foi possível atualizar as informações.");
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <ImageBackground
      source={{ uri: backgroundImageUrl }}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Detalhes do Modelo: {modelDetails.modelo}
        </Text>

        <Text style={styles.subtitle}>Descrição do Problema</Text>
        <Text style={styles.text}>{modelDetails.descricao}</Text>

        <Text style={styles.subtitle}>Prós</Text>
        <TextInput
          style={styles.input}
          value={pros}
          onChangeText={setPros}
          placeholder='Adicionar prós'
        />

        <Text style={styles.subtitle}>Contras</Text>
        <TextInput
          style={styles.input}
          value={contras}
          onChangeText={setContras}
          placeholder='Adicionar contras'
        />

        {loading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : (
          <Button title='Salvar Detalhes' onPress={handleUpdateDetails} />
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semi-transparente para contraste
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    color: "#fff",
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
});
