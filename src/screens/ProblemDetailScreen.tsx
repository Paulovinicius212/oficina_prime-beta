import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function ProblemDetailScreen({ route, navigation }: any) {
  const [problema, setProblema] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Controlar o estado de carregamento

  const { problemaId } = route.params; // Recebe o problemaId da navegação

  const backgroundImageUrl =
    "https://static.vecteezy.com/ti/fotos-gratis/t2/10204314-asiatico-homem-mecanico-automatico-tem-uma-prancheta-e-examina-problema-de-quebra-motor-carro-com-mulher-cliente-e-explica-a-causa-raiz-e-estima-reparacao-cotacao-conceito-de-reparacao-e-manutencao-de-automoveis-foto.jpg"; // Substitua pela URL desejada

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        // Obtém os detalhes do problema do Firebase
        const docRef = doc(db, "problemas", problemaId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProblema(docSnap.data());
        } else {
          Alert.alert("Erro", "Problema não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao carregar os detalhes do problema:", error);
        Alert.alert("Erro", "Não foi possível carregar os detalhes.");
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchProblemDetails();
  }, [problemaId]);

  return (
    <ImageBackground
      source={{ uri: backgroundImageUrl }}
      style={styles.background}
    >
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : problema ? (
          <>
            <Text style={styles.title}>{problema.titulo}</Text>
            <Text style={styles.description}>{problema.descricao}</Text>
            <Text style={styles.label}>Marca: {problema.marca}</Text>
            <Text style={styles.label}>Ano: {problema.ano}</Text>

            <Text style={styles.subtitle}>Prós do Veículo:</Text>
            <Text style={styles.text}>
              {problema.pros && problema.pros.length > 0
                ? problema.pros.join(", ")
                : "Nenhum pró informado."}
            </Text>

            <Text style={styles.subtitle}>Contras do Veículo:</Text>
            <Text style={styles.text}>
              {problema.contras && problema.contras.length > 0
                ? problema.contras.join(", ")
                : "Nenhum contra informado."}
            </Text>

            <Button title='Voltar' onPress={() => navigation.goBack()} />
          </>
        ) : (
          <Text style={styles.errorText}>
            Não foi possível carregar os detalhes do problema.
          </Text>
        )}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semi-transparente para contraste
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: "#fff",
    textAlign: "justify",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: "bold",
    color: "#FFD700", // Destaque em amarelo dourado
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
