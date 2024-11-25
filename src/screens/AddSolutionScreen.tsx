import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { db } from "../services/firebase";
import { collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";

export default function AddSolutionScreen({ route, navigation }: any) {
  const { problemaId } = route.params;
  const [problema, setProblema] = useState<any>(null);

  const [descricaoSolucao, setDescricaoSolucao] = useState("");
  const [pecas, setPecas] = useState("");
  const [mecanico, setMecanico] = useState("");
  const [oficina, setOficina] = useState("");

  const backgroundImageUrl =
    "https://img.freepik.com/fotos-premium/foco-seletivo-em-uma-gaveta-com-ferramentas-de-automecanica-com-trabalhador-consertando-carro_232070-17392.jpg?w=2000"; // Substitua pela URL da imagem desejada

  useEffect(() => {
    const fetchProblema = async () => {
      try {
        const problemaRef = doc(db, "problemas", problemaId);
        const problemaSnap = await getDoc(problemaRef);

        if (problemaSnap.exists()) {
          setProblema(problemaSnap.data());
        } else {
          Alert.alert("Erro", "Problema não encontrado.");
          navigation.goBack();
        }
      } catch (error) {
        console.error("Erro ao buscar problema:", error);
        Alert.alert("Erro", "Não foi possível carregar o problema.");
      }
    };

    fetchProblema();
  }, [problemaId, navigation]);

  const handleAddSolution = async () => {
    if (
      descricaoSolucao.trim() &&
      pecas.trim() &&
      mecanico.trim() &&
      oficina.trim()
    ) {
      try {
        await addDoc(collection(db, "solucoes"), {
          descricao: descricaoSolucao,
          pecas,
          mecanico,
          oficina,
          problemaId,
          dataCriacao: Timestamp.now(),
        });

        Alert.alert("Sucesso", "Solução adicionada!");
        navigation.navigate("Home");
      } catch (error) {
        console.error("Erro ao adicionar solução:", error);
        Alert.alert("Erro", "Não foi possível adicionar a solução.");
      }
    } else {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
    }
  };

  if (!problema) {
    return (
      <ImageBackground
        source={{ uri: backgroundImageUrl }}
        style={styles.background}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando problema...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={{ uri: backgroundImageUrl }}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Adicionar Solução</Text>

        {/* Exibindo informações do problema */}
        <View style={styles.problemaContainer}>
          <Text style={styles.problemaText}>
            <Text style={styles.bold}>Título:</Text> {problema.titulo}
          </Text>
          <Text style={styles.problemaText}>
            <Text style={styles.bold}>Descrição:</Text> {problema.descricao}
          </Text>
          <Text style={styles.problemaText}>
            <Text style={styles.bold}>Marca:</Text> {problema.marca}
          </Text>
          <Text style={styles.problemaText}>
            <Text style={styles.bold}>Ano:</Text> {problema.ano}
          </Text>
        </View>

        {/* Campos da solução */}
        <TextInput
          style={styles.input}
          placeholder='Descrição da Solução'
          value={descricaoSolucao}
          onChangeText={setDescricaoSolucao}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder='Peças utilizadas'
          value={pecas}
          onChangeText={setPecas}
        />
        <TextInput
          style={styles.input}
          placeholder='Mecânico responsável'
          value={mecanico}
          onChangeText={setMecanico}
        />
        <TextInput
          style={styles.input}
          placeholder='Oficina'
          value={oficina}
          onChangeText={setOficina}
        />

        <TouchableOpacity style={styles.button} onPress={handleAddSolution}>
          <Text style={styles.buttonText}>Salvar Solução</Text>
        </TouchableOpacity>
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
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparente para destacar o conteúdo
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  problemaContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  problemaText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 8,
  },
  bold: {
    fontWeight: "bold",
    color: "#000000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "#dc3545",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
