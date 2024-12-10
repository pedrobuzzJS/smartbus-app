import { Image, StyleSheet, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import api from '../service/api';
import { useState, useEffect } from 'react';
import BusList from '../components/OnibusList/OnibusList';
import BusLocationTracking from '../components/OnibusList/OnibusList';

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({ page: 1, rows: 50 });
  const [openMap, setOpenMap] = useState<boolean>(false);
  const [latLong, setLatLong] = useState<any>({latitude: 0, longitude: 0});

  const fetchData = async () => {
    setLoading(true);
    try {
        const response = await api.get(`onibus`);
        setData(response.data.data.data);
        setTotalRecords(response.data.data.total);
        console.log(data)
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination]);

  return (
    <>
      <BusLocationTracking/>
    </>
  );
}