import { API_BASE_URL } from './config';
import { authenticatedFetch, isLoggedIn } from './authUtils';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function PortsPageAjout() {
  const [formData, setFormData] = useState({
    nom_court: '',
    nom: '',
    description: '',
    adresse: '',
    photo: '',
    camera: ''
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
            'Vous devez être connecté pour ajouter un port',
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nom_court.trim()) {
      Alert.alert('Erreur', 'Le nom court est obligatoire');
      return false;
    }
    if (!formData.nom.trim()) {
      Alert.alert('Erreur', 'Le nom complet est obligatoire');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Erreur', 'La description est obligatoire');
      return false;
    }
    if (!formData.adresse.trim()) {
      Alert.alert('Erreur', 'L\'adresse est obligatoire');
      return false;
    }
    if (!formData.photo.trim()) {
      Alert.alert('Erreur', 'Le nom de la photo est obligatoire');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log('🚀 Envoi des données port:', JSON.stringify(formData, null, 2));
      
      const response = await authenticatedFetch(`${API_BASE_URL}/ports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('📊 Réponse API:', response.status);

      if (response.ok) {
        console.log('✅ Port créé avec succès');
        
        // Réinitialiser le formulaire
        setFormData({
          nom_court: '',
          nom: '',
          description: '',
          adresse: '',
          photo: '',
          camera: ''
        });

        // Utiliser le modal personnalisé ET l'Alert natif
        setSuccessModal(true);
        
        // Fermeture automatique du modal après 3 secondes
        setTimeout(() => {
          setSuccessModal(false);
          navigation.navigate('PortsCRUD');
        }, 3000);
        
        setTimeout(() => {
          Alert.alert(
            'Succès', 
            'Le port a été ajouté avec succès',
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('👆 Redirection vers PortsCRUD');
                  navigation.navigate('PortsCRUD');
                }
              }
            ]
          );
        }, 100);
        
      } else if (response.status === 401) {
        console.log('❌ Session expirée');
        Alert.alert('Session expirée', 'Veuillez vous reconnecter');
        navigation.navigate('Login');
      } else {
        console.log('❌ Erreur API:', response.status);
        const data = await response.json().catch(() => ({}));
        Alert.alert('Erreur', data.message || `Erreur ${response.status} lors de l'ajout`);
      }
    } catch (error) {
      console.error('❌ Erreur complète:', error);
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
        <Text style={styles.title}>⚓ Ajouter un nouveau port</Text>
        
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom court *</Text>
            <TextInput
              style={styles.input}
              value={formData.nom_court}
              onChangeText={(value) => handleInputChange('nom_court', value)}
              placeholder="Ex: NICE"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet *</Text>
            <TextInput
              style={styles.input}
              value={formData.nom}
              onChangeText={(value) => handleInputChange('nom', value)}
              placeholder="Ex: Port de Nice"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              placeholder="Description du port, horaires, services..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.adresse}
              onChangeText={(value) => handleInputChange('adresse', value)}
              placeholder="Adresse complète du port"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Photo *</Text>
            <TextInput
              style={styles.input}
              value={formData.photo}
              onChangeText={(value) => handleInputChange('photo', value)}
              placeholder="nom_photo.jpg"
              placeholderTextColor="#999"
            />
            <Text style={styles.helpText}>
              Nom du fichier image (ex: nice.jpg)
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Caméra</Text>
            <TextInput
              style={styles.input}
              value={formData.camera}
              onChangeText={(value) => handleInputChange('camera', value)}
              placeholder="https://exemple.com/camera"
              placeholderTextColor="#999"
            />
            <Text style={styles.helpText}>
              URL de la caméra du port (optionnel)
            </Text>
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
              <Text style={styles.submitButtonText}>✅ Ajouter le port</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de succès */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={successModal}
        onRequestClose={() => {
          setSuccessModal(false);
          navigation.navigate('PortsCRUD');
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✅ Succès !</Text>
            <Text style={styles.modalMessage}>
              Le port a été ajouté avec succès
            </Text>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setSuccessModal(false);
                navigation.navigate('PortsCRUD');
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
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
  },
  content: {
    padding: 20,
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
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
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
    backgroundColor: '#17a2b8',
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#28a745',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
