import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground, // Importando ImageBackground
} from "react-native";
import * as Location from "expo-location";
import { db, auth } from "../services/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function AddProblemScreen({ navigation }: any) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");
  const [solucaoInicial, setSolucaoInicial] = useState("");
  const [pecas, setPecas] = useState("");
  const [mecanico, setMecanico] = useState("");
  const [oficina, setOficina] = useState("");
  const [pros, setPros] = useState("");
  const [contras, setContras] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Não foi possível acessar a localização. Habilite nas configurações do dispositivo."
        );
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    };

    getLocation();
  }, []);

  const handleAddProblemWithSolution = async () => {
    if (
      titulo.trim() &&
      descricao.trim() &&
      marca.trim() &&
      modelo.trim() &&
      ano.trim() &&
      latitude !== null &&
      longitude !== null
    ) {
      try {
        const problemaDoc = await addDoc(collection(db, "problemas"), {
          titulo,
          descricao,
          marca,
          modelo,
          ano,
          pros: pros.split(", "),
          contras: contras.split(", "),
          latitude,
          longitude,
          usuarioId: auth.currentUser?.uid,
          status: "pendente",
          dataCriacao: Timestamp.now(),
        });

        if (solucaoInicial.trim()) {
          await addDoc(collection(db, "solucoes"), {
            descricao: solucaoInicial,
            pecas: pecas.trim() || undefined,
            mecanico: mecanico.trim() || undefined,
            oficina: oficina.trim() || undefined,
            problemaId: problemaDoc.id,
            dataCriacao: Timestamp.now(),
          });
        }

        Alert.alert("Sucesso", "Problema e localização adicionados!");
        navigation.navigate("Home");
      } catch (error) {
        console.error("Erro ao adicionar problema e solução:", error);
        Alert.alert("Erro", "Não foi possível adicionar o problema.");
      }
    } else {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos obrigatórios e habilite a localização."
      );
    }
  };

  return (
    // Usando ImageBackground para definir o fundo com uma URL
    <ImageBackground
      source={{
        uri: "https://media.istockphoto.com/id/1271779268/pt/foto/calling-roadside-assistance.jpg?s=612x612&w=0&k=20&c=TrGNi6StMLnbCv1swJ6TpAqaRK98QNxgIwsxyHvaKdg=", // URL da imagem
      }}
      style={styles.background} // Estilo da imagem de fundo
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Adicionar Problema</Text>

        <TextInput
          style={styles.input}
          placeholder='Título do Problema'
          value={titulo}
          onChangeText={setTitulo}
        />
        <TextInput
          style={styles.input}
          placeholder='Descrição do Problema'
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder='Marca do Veículo'
          value={marca}
          onChangeText={setMarca}
        />
        <TextInput
          style={styles.input}
          placeholder='Modelo do Veículo'
          value={modelo}
          onChangeText={setModelo}
        />
        <TextInput
          style={styles.input}
          placeholder='Ano do Veículo'
          value={ano}
          onChangeText={setAno}
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          placeholder='Prós do Veículo'
          value={pros}
          onChangeText={setPros}
        />
        <TextInput
          style={styles.input}
          placeholder='Contras do Veículo'
          value={contras}
          onChangeText={setContras}
        />
        <TextInput
          style={styles.input}
          placeholder='Descrição da Solução (opcional)'
          value={solucaoInicial}
          onChangeText={setSolucaoInicial}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder='Peças utilizadas (opcional)'
          value={pecas}
          onChangeText={setPecas}
        />
        <TextInput
          style={styles.input}
          placeholder='Mecânico responsável (opcional)'
          value={mecanico}
          onChangeText={setMecanico}
        />
        <TextInput
          style={styles.input}
          placeholder='Oficina (opcional)'
          value={oficina}
          onChangeText={setOficina}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleAddProblemWithSolution}
        >
          <Text style={styles.buttonText}>Salvar Problema</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // Estilo para o ImageBackground, cobrindo toda a tela
  background: {
    flex: 1, // Para ocupar toda a tela
    justifyContent: "center", // Alinha o conteúdo verticalmente no centro
    alignItems: "center", // Alinha o conteúdo horizontalmente no centro
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Cor de fundo semi-transparente para dar contraste
    borderRadius: 8, // Pode dar arredondamento ao container
    width: "80%", // Ajuste a largura do container para deixar mais centralizado
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
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
