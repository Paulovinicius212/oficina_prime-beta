import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "../services/firebase"; // Firebase configurado
import { onAuthStateChanged } from "firebase/auth";

// Telas
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AddProblemScreen from "../screens/AddProblemScreen";
import SolutionsScreen from "../screens/SolutionsScreen"; // Tela de Soluções
import AddSolutionScreen from "../screens/AddSolutionScreen"; // Nova tela para adicionar solução
import RankingScreen from "../screens/RankingScreen"; // Tela de Ranking
import ModeloDetalhesScreen from "../screens/ModeloDetalhesScreen";
import ProblemDetailScreen from "../screens/ProblemDetailScreen";
import MapScreen from "../screens/MapScreen"; // Importe a tela

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Verifica autenticação
    });

    return unsubscribe; // Cleanup listener
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Register' component={RegisterScreen} />
        <Stack.Screen name='AddProblem' component={AddProblemScreen} />
        <Stack.Screen name='Solucoes' component={SolutionsScreen} />
        <Stack.Screen name='AddSolution' component={AddSolutionScreen} />
        <Stack.Screen name='Ranking' component={RankingScreen} />
        <Stack.Screen name='ModeloDetalhes' component={ModeloDetalhesScreen} />
        <Stack.Screen name='ProblemDetail' component={ProblemDetailScreen} />
        <Stack.Screen name='Map' component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
