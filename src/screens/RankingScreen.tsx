import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { db } from "../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

// Definir um tipo para os detalhes dos modelos
interface ModelDetails {
  modelo: string;
  descricao: string;
  pros: string[];
  contras: string[];
  userId: string;
}

interface RankingModel {
  modelo: string;
  count: number;
}

const fetchModelRanking = async (
  filterMarca: string,
  filterAno: string,
  filterModelo: string
) => {
  const problemasRef = collection(db, "problemas");
  const q = query(problemasRef, where("status", "==", "pendente"));
  const querySnapshot = await getDocs(q);

  const modelCounts: { [key: string]: number } = {};
  const modelsWithDetails: ModelDetails[] = []; // Definindo explicitamente o tipo de `modelsWithDetails`

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const marca = data.marca || "Desconhecido";
    const ano = data.ano || "Desconhecido";
    const modelo = data.modelo || "Desconhecido";
    const descricao = data.descricao || "Sem descrição";
    const userId = data.usuarioId;
    const pros = data.pros || [];
    const contras = data.contras || [];

    if (
      (filterMarca && marca.toLowerCase() === filterMarca.toLowerCase()) ||
      !filterMarca
    ) {
      if ((filterAno && ano === filterAno) || !filterAno) {
        if (
          (filterModelo &&
            modelo.toLowerCase().includes(filterModelo.toLowerCase())) ||
          !filterModelo
        ) {
          modelsWithDetails.push({
            modelo,
            descricao,
            pros,
            contras,
            userId,
          });
          modelCounts[modelo] = (modelCounts[modelo] || 0) + 1;
        }
      }
    }
  });

  const sortedModels = Object.entries(modelCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const rankingModels: RankingModel[] = sortedModels.map(([modelo, count]) => ({
    modelo,
    count,
  }));

  return { rankingModels, modelsWithDetails };
};

export default function RankingScreen({ navigation }: any) {
  const [rankingModels, setRankingModels] = useState<RankingModel[]>([]);
  const [modelsWithDetails, setModelsWithDetails] = useState<ModelDetails[]>(
    []
  );
  const [filterMarca, setFilterMarca] = useState<string>("");
  const [filterAno, setFilterAno] = useState<string>("");
  const [filterModelo, setFilterModelo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const backgroundImageUrl =
    "https://media.istockphoto.com/id/660523594/photo/car-crash-with-police.jpg?s=612x612&w=0&k=20&c=OhRaklgFOFwk0q2SpccfTmibL2evFJkknBDAIFx6FDc="; // Substitua pela URL desejada

  useEffect(() => {
    const getRanking = async () => {
      setLoading(true); // Iniciar o carregamento
      const { rankingModels, modelsWithDetails } = await fetchModelRanking(
        filterMarca,
        filterAno,
        filterModelo
      );
      setRankingModels(rankingModels);
      setModelsWithDetails(modelsWithDetails);
      setLoading(false); // Finalizar o carregamento
    };

    getRanking();
  }, [filterMarca, filterAno, filterModelo]);

  const handlePress = (modelo: string) => {
    const modelDetails = modelsWithDetails.find(
      (model) => model.modelo === modelo
    );
    if (modelDetails) {
      navigation.navigate("ModeloDetalhes", { modelDetails });
    }
  };

  return (
    <ImageBackground
      source={{ uri: backgroundImageUrl }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Ranking dos Modelos com Mais Problemas</Text>

        <TextInput
          style={styles.input}
          placeholder='Filtrar por marca'
          placeholderTextColor='#aaa'
          value={filterMarca}
          onChangeText={setFilterMarca}
        />
        <TextInput
          style={styles.input}
          placeholder='Filtrar por ano'
          placeholderTextColor='#aaa'
          value={filterAno}
          onChangeText={setFilterAno}
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          placeholder='Filtrar por modelo'
          placeholderTextColor='#aaa'
          value={filterModelo}
          onChangeText={setFilterModelo}
        />

        {loading ? (
          <ActivityIndicator size='large' color='#FFD700' />
        ) : (
          <FlatList
            data={rankingModels}
            keyExtractor={(item) => item.modelo}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handlePress(item.modelo)}
              >
                <Text style={styles.itemText}>
                  Modelo: {item.modelo} - Problemas: {item.count}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}

        <Button
          title='Limpar Filtros'
          onPress={() => {
            setFilterMarca("");
            setFilterAno("");
            setFilterModelo("");
          }}
          color='#FF4500'
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
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Fundo semi-transparente para contraste
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#FFD700",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFD700",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  item: {
    marginBottom: 12,
    padding: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  itemText: {
    fontSize: 16,
    color: "#fff",
  },
});
