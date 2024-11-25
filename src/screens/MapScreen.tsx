import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  titulo: string;
  descricao: string;
}

export default function MapScreen() {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permissão negada",
            "Permissão para acessar a localização foi negada."
          );
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Erro ao obter localização:", error);
        Alert.alert("Erro", "Não foi possível obter a localização do usuário.");
      } finally {
        setLoading(false);
      }
    };

    const fetchMarkers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "problemas"));
        const fetchedMarkers: MarkerData[] = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            if (
              data.latitude &&
              data.longitude &&
              data.titulo &&
              data.descricao
            ) {
              return {
                id: doc.id,
                latitude: data.latitude,
                longitude: data.longitude,
                titulo: data.titulo,
                descricao: data.descricao,
              };
            }
            return null;
          })
          .filter((item) => item !== null) as MarkerData[];
        setMarkers(fetchedMarkers);
      } catch (error) {
        console.error("Erro ao buscar dados do Firebase:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do mapa.");
      }
    };

    fetchUserLocation();
    fetchMarkers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
        <Text>Carregando mapa e localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userLocation ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Marcar a localização do usuário */}
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title='Sua localização'
            description='Este é o local atual do usuário.'
          />

          {/* Marcar os outros problemas */}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.titulo}
              description={marker.descricao}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Não foi possível carregar sua localização.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
