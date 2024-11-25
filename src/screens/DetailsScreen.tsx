import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, Button, StyleSheet, ImageBackground } from "react-native";

// Defina os tipos para a navegação
export type RootStackParamList = {
  Home: undefined;
  Details: { itemId: number };
};

// Criar o Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const backgroundImageUrl =
  "https://img.freepik.com/fotos-premium/manutencao-de-veiculos-oficina-mecanica-e-ia-generativa_28914-9662.jpg"; // Substitua pela URL desejada

// HomeScreen: Página inicial
function HomeScreen({ navigation }: any) {
  return (
    <ImageBackground
      source={{ uri: backgroundImageUrl }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Home Screen</Text>
        <Button
          title='Go to Details'
          onPress={() => navigation.navigate("Details", { itemId: 42 })}
        />
      </View>
    </ImageBackground>
  );
}

// DetailsScreen: Página de detalhes
function DetailsScreen({ route }: any) {
  const { itemId } = route.params;
  return (
    <ImageBackground
      source={{ uri: backgroundImageUrl }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Details Screen: {itemId}</Text>
      </View>
    </ImageBackground>
  );
}

// Criar o Stack Navigator
export default function App() {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Details' component={DetailsScreen} />
    </Stack.Navigator>
  );
}

// Estilos
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semi-transparente para contraste
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ffffff", // Texto em branco para contraste
  },
});
