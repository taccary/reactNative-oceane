import { API_BASE_URL } from './config';
import { authenticatedFetch, isLoggedIn } from './authUtils';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Modal, Platform } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

export default function SecteursPageModif() {
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    photo: '',
    url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [successModal, setSuccessModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { secteur } = route.params;

  // Vérifier l'authentification et charger les données
  useFocusEffect(
    React.useCallback(() => {
      const checkAuthAndLoad = async () => {
        const loggedIn = await isLoggedIn();
        if (!loggedIn) {
          Alert.alert(
            'Authentification requise', 
            'Vous devez être connecté pour modifier un secteur',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Login')
              }
            ]
          );
          return;
        }
        await loadSecteurData();
      };
      checkAuthAndLoad();
    }, [secteur])
  );

  const loadSecteurData = async () => {
    setIsLoadingData(true);
    try {
      const response = await fetch(`${API_BASE_URL}/secteurs/${secteur}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          nom: data.nom || '',
          description: data.description || '',
          photo: data.photo || '',
          url: data.url || ''
        });
      } else {
        Alert.alert('Erreur', 'Impossible de charger les données du secteur');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Erreur de connexion');
      navigation.goBack();
    } finally {
      setIsLoadingData(false);
    }
  };

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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    // Afficher le modal de confirmation
    setConfirmModal(true);
  };

  const confirmSubmit = async () => {
    // Fermer le modal de confirmation
    setConfirmModal(false);

    setIsLoading(true);
    try {
      console.log('URL de modification:', `${API_BASE_URL}/secteurs/${secteur}`);
      console.log('Données envoyées:', JSON.stringify(formData, null, 2));

      const response = await authenticatedFetch(`${API_BASE_URL}/secteurs/${secteur}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('📊 Réponse API modification:', response.status);

      if (response.ok) {
        console.log('✅ Secteur modifié avec succès');
        
        // Afficher le modal de succès
        setSuccessModal(true);
        
        // Fermeture automatique du modal et redirection après 3 secondes
        setTimeout(() => {
          setSuccessModal(false);
          console.log('👆 Redirection vers SecteursCRUD après modification');
          navigation.navigate('SecteursCRUD');
        }, 3000);
        
      } else if (response.status === 401) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter');
        navigation.navigate('Login');
      } else {
        console.log('❌ Erreur API modification:', response.status);
        const data = await response.json().catch(() => ({}));
        Alert.alert('Erreur', data.message || `Erreur ${response.status} lors de la modification`);
      }
    } catch (error) {
      console.error('❌ Erreur complète modification:', error);
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

  if (isLoadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🗺️ Modifier le secteur</Text>
        <Text style={styles.subtitle}>Secteur ID: {secteur}</Text>
        
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
              <Text style={styles.submitButtonText}>✅ Modifier le secteur</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de confirmation */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={confirmModal}
        onRequestClose={() => setConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer les modifications</Text>
            <Text style={styles.modalMessage}>
              Êtes-vous sûr de vouloir modifier le secteur "{formData.nom}" ?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setConfirmModal(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmSubmit}
              >
                <Text style={styles.modalButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
              Le secteur "{formData.nom}" a été modifié avec succès
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    fontStyle: 'italic',
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
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: '#28a745',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
