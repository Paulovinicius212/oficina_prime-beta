import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { auth, db } from "../services/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function HomeScreen({ navigation }: any) {
  const [problemas, setProblemas] = useState<any[]>([]);
  const [filteredProblemas, setFilteredProblemas] = useState<any[]>([]);
  const [filterMarca, setFilterMarca] = useState("");
  const [filterProblema, setFilterProblema] = useState("");
  const [loading, setLoading] = useState(true);

  const backgroundImageUrl =
    "https://plus.unsplash.com/premium_photo-1677009541474-1fc2642943c1?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVjYW5pY298ZW58MHx8MHx8fDA%3D"; // Substitua pela URL desejada

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "problemas"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProblemas(data);
      setFilteredProblemas(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let filtered = problemas;

    if (filterMarca) {
      filtered = filtered.filter(
        (item) =>
          item.marca &&
          item.marca.toLowerCase().includes(filterMarca.toLowerCase())
      );
    }

    if (filterProblema) {
      filtered = filtered.filter(
        (item) =>
          item.titulo &&
          item.titulo.toLowerCase().includes(filterProblema.toLowerCase())
      );
    }

    setFilteredProblemas(filtered);
  }, [filterMarca, filterProblema, problemas]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace("Login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <ImageBackground
      source={{ uri: backgroundImageUrl }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo, {auth.currentUser?.email}</Text>
        <Button title='Sair' onPress={handleLogout} color='#ff4d4d' />

        <View style={styles.filterContainer}>
          <TextInput
            style={styles.input}
            placeholder='Filtrar por marca de carro'
            value={filterMarca}
            onChangeText={setFilterMarca}
          />
          <TextInput
            style={styles.input}
            placeholder='Filtrar por problema'
            value={filterProblema}
            onChangeText={setFilterProblema}
          />
        </View>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("Ranking")}
        >
          <Text style={styles.cardButtonText}>Ver Ranking dos Modelos</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : filteredProblemas.length === 0 ? (
          <Text style={styles.noResultsText}>Nenhum problema encontrado.</Text>
        ) : (
          <FlatList
            data={filteredProblemas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardText}>
                  Marca: {item.marca ? item.marca : "N/A"}
                </Text>
                <Text style={styles.cardText}>
                  Problema: {item.titulo ? item.titulo : "N/A"}
                </Text>
                <Button
                  title='Ver Soluções'
                  onPress={() =>
                    navigation.navigate("Solucoes", { problemaId: item.id })
                  }
                  color='#2196F3'
                />
                <Button
                  title='Adicionar Solução'
                  onPress={() =>
                    navigation.navigate("AddSolution", { problemaId: item.id })
                  }
                  color='#FFC237'
                />
              </View>
            )}
          />
        )}

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("AddProblem")}
        >
          <Text style={styles.cardButtonText}>Adicionar Novo Problema</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => navigation.navigate("Map")}
        >
          <Text style={styles.cardButtonText}>Ver Mapa</Text>
        </TouchableOpacity>
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
    marginBottom: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  filterContainer: {
    flexDirection: "column",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  card: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  cardButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  cardButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noResultsText: {
    fontSize: 18,
    color: "#FF5722",
    textAlign: "center",
    marginTop: 2,
  },
});
