import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import api from '@/app/service/api';
import * as Location from 'expo-location';

type Bus = {
  id: number;
  name: string;
  isActive: boolean;
};

const BusLocationTracking = () => {
  const [activeBusId, setActiveBusId] = useState<number | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [watchingLocation, setWatchingLocation] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const sendLocation = (location: Location.LocationObject | null) => {
    api.put(`/onibus/localizacao/${activeBusId}`,
      {
        "latitude": String(location?.coords.latitude),
        "longitude": String(location?.coords.longitude)
      }
    )
    return true
  }

  const buses: Bus[] = [
    { id: 1, name: 'Ônibus 1', isActive: false },
    { id: 2, name: 'Ônibus 2', isActive: false },
    { id: 3, name: 'Ônibus 3', isActive: false },
  ];

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
        const response = await api.get(`onibus?page=${page}`);
        setData(response.data.data.data);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    } finally {
        setLoading(false);
    }
};

  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
      return;
    }

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000 },
      (newLocation) => {
        setLocation(newLocation);
        sendLocation(newLocation)
      }
    );
  };

  const handleToggleBus = (busId: number) => {
    setActiveBusId((prev) => (prev === busId ? null : busId));
  };

  useEffect(() => {
    fetchData();
}, []);

  useEffect(() => {
    if (activeBusId !== null && !watchingLocation) {
      setWatchingLocation(true);
      startLocationTracking();
    } else if (activeBusId === null && watchingLocation) {
      setWatchingLocation(false);
    }
  }, [activeBusId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoramento de Ônibus</Text>      
      <View style={styles.busListContainer}>
        {data?.map((bus) => (
          <View
            key={bus.id}
            style={[
              styles.card,
              bus.id === activeBusId ? { backgroundColor: '#f8d7da' } : {}, // Cor do card ativo
            ]}
          >
            <Text style={styles.cardText}>{bus.nome}</Text>
            <Text style={styles.cardText}>{bus.marca}</Text>
            <TouchableOpacity
              onPress={() => handleToggleBus(bus.id)}
              style={[
                styles.button,
                bus.id === activeBusId ? { backgroundColor: 'red' } : { backgroundColor: 'green' }, // Cor do botão
              ]}
              disabled={activeBusId !== null && bus.id !== activeBusId} // Desabilita outros botões
            >
              <Text style={styles.buttonText}>{bus.id === activeBusId ? 'Desativar' : 'Ativar'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {location && (
        <View style={styles.locationContainer}>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  busListContainer: {
    width: '100%',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Cor de fundo padrão do card
  },
  cardText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f8f9fa',
  },
});

export default BusLocationTracking;
