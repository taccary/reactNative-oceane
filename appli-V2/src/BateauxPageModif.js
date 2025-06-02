import { API_BASE_URL } from './config';
import { IMAGES_URL } from './config';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BateauxPageModif({ route }) {
  const bateauId = route.params.bateau;
  const [bateau, setBateau] = useState(null);
  const [nom, setNom] = useState('');
  const [desc, setDesc] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBateau = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/bateaux/${bateauId}`);
        if (response.status === 200) {
          const data = await response.json();
          setBateau(data);
        } else {
          Alert.alert('Erreur', 'Impossible de charger le bateau');
        }
      } catch (error) {
        Alert.alert('Erreur', 'Erreur de connexion');
      }
    };

    fetchBateau();
  }, [bateauId]);

  useEffect(() => {
    if (bateau) {
      setNom(bateau.nom);
      setDesc(bateau.description);
    }
  }, [bateau]);

  const handleSubmit = async () => {
    const idNum = parseInt(bateauId, 10);

    if (isNaN(idNum) || !nom || !desc) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs correctement');
      return;
    }

    const updatedBateau = {
      id: idNum,
      nom,
      description: desc,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/bateaux/${bateauId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBateau),
      });

      if (response.ok) {
        Alert.alert('Succès', 'Le bateau a été modifié avec succès');
        navigation.navigate('Bateaux');
      } else {
        const data = await response.json();
        Alert.alert('Erreur', data.message || 'Une erreur est survenue lors de la mise à jour');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de contacter le serveur');
    }
  };

  return (
    <View style={styles.container}>
      {bateau ? (
        <View>
          <Text style={styles.label}>Identifiant :</Text>
          <Text>{bateauId}</Text>

          <Text style={styles.label}>Nom :</Text>
          <TextInput
            style={styles.input}
            value={nom}
            onChangeText={setNom}
          />

          <Text style={styles.label}>Description :</Text>
          <TextInput
            style={styles.input}
            value={desc}
            onChangeText={setDesc}
          />

          <View style={styles.button}>
            <Button title="Modifier" onPress={handleSubmit} color="#00BF6D" />
          </View>
        </View>
      ) : (
        <Text>Chargement du bateau...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 16,
    borderRadius: 6,
  },
  button: {
    marginTop: 20,
  },
});
