import { API_BASE_URL } from './config';
import { IMAGES_URL } from './config';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BateauxPage() {
  const [bateaux, setBateaux] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBateaux = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bateaux`);
        if (response.status === 200) {
          const data = await response.json();
          setBateaux(data);
        } else {
          Alert.alert('Erreur', 'Impossible de charger les bateaux');
        }
      } catch (error) {
        Alert.alert('Erreur', 'Erreur de connexion');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBateaux();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00BF6D" />
      </View>
    );
  }



  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('BateauDetails', { bateau: item.id })}>
      <View style={styles.card}>
        <Image
          source={{ uri: `${IMAGES_URL}/bateaux/${item.photo}` }}
          style={styles.photo}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.nom}>{item.nom}</Text>
          <Text style={styles.details}>Longueur : {item.longueur} m | Largeur : {item.largeur} m</Text>
          <Text style={styles.details}>Vitesse : {item.vitesse_croisiere} nœuds | Niveau PMR : {item.niveauPMR}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚢 Catalogue des bateaux</Text>
      <Text style={styles.subtitle}>Découvrez notre flotte</Text>
      <FlatList
        data={bateaux}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 8,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#DDD',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  details: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
});