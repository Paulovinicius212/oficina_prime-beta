import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import DetailsScreen from "../screens/DetailsScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen
        name='Home'
        component={HomeScreen}
        options={{ title: "Página Inicial" }}
      />
      <Stack.Screen
        name='Details'
        component={DetailsScreen}
        options={{ title: "Detalhes" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
