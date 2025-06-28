import { API_BASE_URL } from './config';
import { IMAGES_URL } from './config';
import { authenticatedFetch, isLoggedIn } from './authUtils';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BateauxPageModif({ route }) {
  const bateauId = route.params.bateau;
  const [bateau, setBateau] = useState(null);
  const [nom, setNom] = useState('');
  const [desc, setDesc] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      // Vérifier l'authentification
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        Alert.alert(
          'Authentification requise', 
          'Vous devez être connecté pour modifier un bateau',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
        return;
      }

      // Récupérer les données du bateau (pas besoin d'auth pour la lecture)
      try {
        const response = await fetch(`${API_BASE_URL}/bateaux/${bateauId}`);
        if (response.status === 200) {
          const data = await response.json();        setBateau(data);
        setNom(data.nom || '');
        setDesc(data.description || '');
      } else {
        Alert.alert('Erreur', 'Impossible de charger le bateau');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
    };

    checkAuthAndFetch();
  }, [bateauId, navigation]);

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

    // Vérifier l'authentification avant la modification
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      Alert.alert('Non authentifié', 'Veuillez vous connecter pour modifier un bateau');
      navigation.navigate('Login');
      return;
    }

    const updatedBateau = {
      id: idNum,
      nom,
      description: desc,
    };

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/bateaux/${bateauId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedBateau),
      });

      if (response.ok) {
        Alert.alert('Succès', 'Le bateau a été modifié avec succès');
        navigation.navigate('BateauxCRUD');
      } else if (response.status === 401) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter');
        navigation.navigate('Login');
      } else {
        const data = await response.json();
        Alert.alert('Erreur', data.message || 'Une erreur est survenue lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (error.message.includes('Token')) {
        Alert.alert('Non authentifié', 'Veuillez vous connecter');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erreur', 'Impossible de contacter le serveur');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Chargement du bateau...</Text>
        </View>
      ) : bateau ? (
        <View style={styles.formCard}>
          <Text style={styles.title}>✏️ Modifier le bateau</Text>
          
          <Text style={styles.label}>Identifiant</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>{bateauId}</Text>
          </View>

          <Text style={styles.label}>Nom du bateau *</Text>
          <TextInput
            style={styles.input}
            value={nom}
            onChangeText={setNom}
            placeholder="Nom du bateau"
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={desc}
            onChangeText={setDesc}
            placeholder="Description du bateau"
            multiline={true}
            numberOfLines={4}
          />

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>💾 Sauvegarder</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>❌ Annuler</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur lors du chargement du bateau</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  formCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  readOnlyField: {
    backgroundColor: '#e9ecef',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  readOnlyText: {
    fontSize: 16,
    color: '#6c757d',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
  },
});
