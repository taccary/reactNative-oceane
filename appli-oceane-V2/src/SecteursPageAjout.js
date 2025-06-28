import { API_BASE_URL } from './config';
import { authenticatedFetch, isLoggedIn } from './authUtils';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Modal, Platform } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function SecteursPageAjout() {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    photo: '',
    url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const navigation = useNavigation();

  // Vérifier l'authentification
  useFocusEffect(
    React.useCallback(() => {
      const checkAuth = async () => {
        const loggedIn = await isLoggedIn();
        if (!loggedIn) {
          Alert.alert(
            'Authentification requise', 
            'Vous devez être connecté pour ajouter un secteur',
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
    }, [])
  );

  const validateForm = () => {
    if (!formData.nom.trim()) {
      Alert.alert('Erreur', 'Le nom du secteur est obligatoire');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Erreur', 'La description est obligatoire');
      return false;
    }
    if (!formData.photo.trim()) {
      Alert.alert('Erreur', 'Le nom du fichier photo est obligatoire');
      return false;
    }
    if (!formData.url.trim()) {
      Alert.alert('Erreur', 'L\'URL du secteur est obligatoire');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      photo: '',
      url: ''
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log('📤 Données à envoyer:', JSON.stringify(formData, null, 2));

      const response = await authenticatedFetch(`${API_BASE_URL}/secteurs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('📊 Réponse API ajout:', response.status);

      if (response.ok) {
        console.log('✅ Secteur ajouté avec succès');
        
        // Afficher le modal de succès
        setSuccessModal(true);
        
        // Réinitialiser le formulaire
        resetForm();
        
        // Fermeture automatique du modal après 3 secondes
        setTimeout(() => {
          setSuccessModal(false);
          navigation.navigate('SecteursCRUD');
        }, 3000);
        
        // Alert natif en complément
        setTimeout(() => {
          Alert.alert(
            'Succès', 
            'Le secteur a été ajouté avec succès',
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('👆 Navigation vers SecteursCRUD après ajout');
                  navigation.navigate('SecteursCRUD');
                }
              }
            ]
          );
        }, 100);
      } else if (response.status === 401) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter');
        navigation.navigate('Login');
      } else {
        console.log('❌ Erreur API ajout:', response.status);
        const data = await response.json().catch(() => ({}));
        Alert.alert('Erreur', data.message || `Erreur ${response.status} lors de l'ajout`);
      }
    } catch (error) {
      console.error('❌ Erreur complète ajout:', error);
      if (error.message.includes('Token')) {
        Alert.alert('Non authentifié', 'Veuillez vous connecter');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erreur', 'Impossible de contacter le serveur: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🗺️ Ajouter un secteur</Text>
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom du secteur *</Text>
            <TextInput
              style={styles.input}
              value={formData.nom}
              onChangeText={(text) => setFormData({...formData, nom: text})}
              placeholder="Ex: Mer du Nord"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL du secteur *</Text>
            <TextInput
              style={styles.input}
              value={formData.url}
              onChangeText={(text) => setFormData({...formData, url: text})}
              placeholder="Ex: https://oceane.fr/secteur/nord"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Description détaillée du secteur de navigation..."
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Photo (nom du fichier) *</Text>
            <TextInput
              style={styles.input}
              value={formData.photo}
              onChangeText={(text) => setFormData({...formData, photo: text})}
              placeholder="Ex: mer-du-nord.jpg"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>❌ Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.submitButtonText}>✅ Ajouter le secteur</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de succès */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={successModal}
        onRequestClose={() => {
          setSuccessModal(false);
          navigation.navigate('SecteursCRUD');
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.successModalContent}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Succès !</Text>
            <Text style={styles.successMessage}>
              Le secteur "{formData.nom}" a été ajouté avec succès
            </Text>
            <Text style={styles.successSubMessage}>
              Redirection automatique...
            </Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    ...Platform.select({
      web: {
        height: '100vh',
      },
    }),
  },
  content: {
    padding: 20,
    ...Platform.select({
      web: {
        minHeight: '100%',
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  form: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  successModalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    elevation: 5,
  },
  successIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  successSubMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
