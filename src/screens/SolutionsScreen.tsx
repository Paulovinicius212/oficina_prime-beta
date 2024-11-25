import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { db } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function SolutionScreen({ route, navigation }: any) {
  const { problemaId } = route.params; // Recebe o ID do problema
  const [solucoes, setSolucoes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const backgroundImageUrl =
    "https://chiptronic.com.br/blog/wp-content/uploads/2019/09/equipamentos-para-oficina.jpg"; // Substitua pela URL desejada

  useEffect(() => {
    const fetchSolucoes = async () => {
      try {
        const solucoesRef = collection(db, "solucoes");
        const q = query(solucoesRef, where("problemaId", "==", problemaId));
        const querySnapshot = await getDocs(q);

        const solucoesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSolucoes(solucoesData);
      } catch (error) {
        console.error("Erro ao buscar soluções:", error);
        Alert.alert("Erro", "Não foi possível carregar as soluções.");
      } finally {
        setLoading(false);
      }
    };

    fetchSolucoes();
  }, [problemaId]);

  if (loading) {
    return (
      <ImageBackground
        source={{ uri: backgroundImageUrl }}
        style={styles.background}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#FFD700' />
          <Text style={styles.loadingText}>Carregando soluções...</Text>
        </View>
      </ImageBackground>
    );
  }

  if (solucoes.length === 0) {
    return (
      <ImageBackground
        source={{ uri: backgroundImageUrl }}
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.emptyText}>Nenhuma solução encontrada.</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={{ uri: backgroundImageUrl }}
      style={styles.background}
    >
      <View style={styles.container}>
        <FlatList
          data={solucoes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.solucaoContainer}>
              <Text style={styles.label}>Descrição:</Text>
              <Text style={styles.text}>{item.descricao}</Text>

              <Text style={styles.label}>Peças utilizadas:</Text>
              <Text style={styles.text}>{item.pecas}</Text>

              <Text style={styles.label}>Mecânico responsável:</Text>
              <Text style={styles.text}>{item.mecanico}</Text>

              <Text style={styles.label}>Oficina:</Text>
              <Text style={styles.text}>{item.oficina}</Text>

              <Text style={styles.label}>Data:</Text>
              <Text style={styles.text}>
                {item.dataCriacao.toDate().toLocaleDateString("pt-BR")}
              </Text>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Fundo semi-transparente para contraste
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FFD700",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
    color: "#FFD700",
    fontWeight: "bold",
  },
  solucaoContainer: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    borderColor: "#FFD700",
    borderWidth: 1,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#FFD700",
  },
  text: {
    marginBottom: 8,
    color: "#fff",
  },
});
