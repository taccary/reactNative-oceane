import { API_BASE_URL } from './config';
import { IMAGES_URL } from './config';
import { authenticatedFetch, isLoggedIn } from './authUtils';
import React, {useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BateauxPageAjout() {
    const [id, setID] = useState('');
    const [nom, setNom] = useState('');
    const [desc, setDesc] = useState('');
    const navigation = useNavigation();

    // Vérifier l'authentification au chargement de la page
    useEffect(() => {
        const checkAuth = async () => {
            const loggedIn = await isLoggedIn();
            if (!loggedIn) {
                Alert.alert(
                    'Authentification requise', 
                    'Vous devez être connecté pour ajouter un bateau',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Login')
                        }
                    ]
                );
            }
        };
        checkAuth();
    }, [navigation]);

    
    const handleSubmit = async () => {
  const idNum = parseInt(id, 10);

  if (!id || isNaN(idNum) || !nom || !desc) {
    Alert.alert('Erreur', 'Veuillez remplir tous les champs correctement');
    return;
  }

  // Vérifier l'authentification avant l'envoi
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    Alert.alert('Non authentifié', 'Veuillez vous connecter pour ajouter un bateau');
    navigation.navigate('Login');
    return;
  }

  const bateau = {
    id: idNum,
    nom,
    description: desc,
  };

  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/bateaux`, {
      method: 'POST',
      body: JSON.stringify(bateau),
    });

    if (response.ok) {
      Alert.alert('Succès', 'Le bateau a été créé avec succès');
      setID('');
      setNom('');
      setDesc('');
      navigation.navigate('BateauxCRUD');
    } else if (response.status === 401) {
      Alert.alert('Session expirée', 'Veuillez vous reconnecter');
      navigation.navigate('Login');
    } else {
      const data = await response.json();
      Alert.alert('Erreur', data.message || 'Une erreur est survenue lors de la création');
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
            <View style={styles.formCard}>
                <Text style={styles.title}>➕ Ajouter un nouveau bateau</Text>
                
                <Text style={styles.label}>Identifiant *</Text>
                <TextInput 
                    style={styles.input} 
                    value={id} 
                    onChangeText={setID}
                    placeholder="Ex: 123"
                    keyboardType="numeric"
                />
                
                <Text style={styles.label}>Nom du bateau *</Text>
                <TextInput
                    style={styles.input}
                    value={nom}
                    onChangeText={setNom}
                    placeholder="Ex: Ocean Explorer"
                />
                
                <Text style={styles.label}>Description *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={desc}
                    onChangeText={setDesc}
                    placeholder="Décrivez le bateau..."
                    multiline={true}
                    numberOfLines={4}
                />
                
                <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>✅ Créer le bateau</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.cancelButtonText}>❌ Annuler</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
    
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
  submitButton: {
    backgroundColor: '#28a745',
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
});
