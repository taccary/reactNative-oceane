import { API_BASE_URL } from './config';
import { IMAGES_URL } from './config';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


export default function BateauDetailPage({ route }) {
  const bateauId = route.params.bateau;
  const [bateau, setBateau] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    
    const fetchBateau = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${bateauId}`);
        if (response.status === 200) {
          const data = await response.json();
          setBateau(data);
        } else {
          Alert.alert('Erreur', 'Impossible de charger le bateau');
        }
      } catch (error) {
        Alert.alert('Erreur', 'Erreur de connexion');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBateau();
  }, [bateauId]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00BF6D" />
      </View>
    );
  }

  if (!bateau) {
    return (
      <View style={styles.container}>
        <Text>Le bateau n'a pas été trouvé.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: `${IMAGES_URL}/${bateau.photo}` }}
        style={styles.photo}
      />
      <Text style={styles.nom}>{bateau.nom}</Text>
      <Text style={styles.desc}>{bateau.description}</Text>
      <Text style={styles.details}>Longueur : {bateau.longueur} m</Text>
      <Text style={styles.details}>Largeur : {bateau.largeur} m</Text>
      <Text style={styles.details}>Vitesse : {bateau.vitesse_croisiere} nœuds</Text>
      <Text style={styles.details}>Niveau PMR : {bateau.niveauPMR}</Text>
      if ()
      <TouchableOpacity
        style={styles.greenButton}
        onPress={() => navigation.navigate('ModifBateaux', { bateau: bateau.id})}
      >
        <Text style={styles.buttonText}>Modifier le bateau</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.redButton}
        onPress={() => navigation.navigate('SuppBateaux', { bateau:  bateau.id })}
      >
        <Text style={styles.buttonText}>Supprimer le bateau</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#DDD',
  },
  nom: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  desc: {
    fontSize: 16,
    marginBottom: 12,
    color: '#444',
    textAlign: 'center',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  redButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 13.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  greenButton: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    paddingVertical: 10,
  }
});