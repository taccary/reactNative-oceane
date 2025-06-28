import { API_BASE_URL } from './config';
import { IMAGES_URL } from './config';
import { authenticatedFetch, isLoggedIn } from './authUtils';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function PortsCRUDPage() {
  const [ports, setPorts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ visible: false, port: null });
  const [successModal, setSuccessModal] = useState(false);
  const navigation = useNavigation();

  // Vérifier l'authentification à chaque fois que la page devient active
  useFocusEffect(
    React.useCallback(() => {
      const checkAuthAndFetch = async () => {
        const loggedIn = await isLoggedIn();
        if (!loggedIn) {
          Alert.alert(
            'Authentification requise', 
            'Vous devez être connecté pour accéder à la gestion des ports',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Login')
              }
            ]
          );
          return;
        }
        fetchPorts();
      };

      checkAuthAndFetch();
    }, [])
  );

  const fetchPorts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ports`);
      if (response.status === 200) {
        const data = await response.json();
        setPorts(data);
      } else {
        Alert.alert('Erreur', 'Impossible de charger les ports');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (portId, portNom) => {
    console.log('handleDelete appelé avec portId (nom_court):', portId, 'portNom:', portNom);
    setDeleteModal({ visible: true, port: { id: portId, nom: portNom } });
  };

  const performDelete = async () => {
    const { id, nom } = deleteModal.port;
    console.log('🔍 performDelete - nom_court à supprimer:', id);
    console.log('🔍 Type de nom_court:', typeof id);
    console.log('🔍 Valeur encodée:', encodeURIComponent(id));
    console.log('🔍 URL de suppression complète:', `${API_BASE_URL}/ports/${encodeURIComponent(id)}`);
    
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/ports/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Réponse API suppression - Status:', response.status);
      console.log('📊 Réponse API suppression - Headers:', response.headers);

      if (response.ok) {
        console.log('✅ Port supprimé avec succès');
        
        // Fermer le modal de confirmation
        setDeleteModal({ visible: false, port: null });
        
        // Afficher le modal de succès
        setSuccessModal(true);
        
        // Recharger la liste
        await fetchPorts();
        
        // Fermeture automatique du modal de succès après 2 secondes
        setTimeout(() => {
          setSuccessModal(false);
        }, 2000);
        
      } else {
        console.log('Erreur API suppression - Status:', response.status);
        
        // Lire la réponse d'erreur
        const errorText = await response.text();
        console.log('Réponse erreur complète:', errorText);
        
        setDeleteModal({ visible: false, port: null });
        
        if (response.status === 401) {
          Alert.alert('Session expirée', 'Veuillez vous reconnecter');
          navigation.navigate('Login');
        } else {
          try {
            const errorData = JSON.parse(errorText);
            Alert.alert('Erreur', errorData.message || 'Erreur lors de la suppression');
          } catch {
            Alert.alert('Erreur', `Erreur ${response.status}: ${errorText}`);
          }
        }
      }
    } catch (error) {
      console.error('Erreur suppression complète:', error);
      setDeleteModal({ visible: false, port: null });
      if (error.message.includes('Token')) {
        Alert.alert('Non authentifié', 'Veuillez vous connecter');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erreur', 'Impossible de contacter le serveur: ' + error.message);
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des ports...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.cardContent}
        onPress={() => navigation.navigate('PortDetails', { port: item.nom_court })}
      >
        <Image
          source={{ uri: `${IMAGES_URL}/ports/${item.photo}` }}
          style={styles.photo}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.nom}>{item.nom_court}</Text>
          <Text style={styles.details}>{item.nom}</Text>
          <Text style={styles.details}>{item.adresse}</Text>
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      
      {/* Boutons d'action */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('ModifPorts', { port: item.nom_court })}
        >
          <Text style={styles.actionButtonText}>✏️ Modifier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.nom_court, item.nom)}
        >
          <Text style={styles.actionButtonText}>🗑️ Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des ports</Text>
      
      {/* Bouton d'ajout en haut */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AjoutPorts')}
      >
        <Text style={styles.addButtonText}>➕ Ajouter un nouveau port</Text>
      </TouchableOpacity>

      {ports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun port disponible</Text>
        </View>
      ) : (
        <FlatList
          data={ports}
          keyExtractor={item => item.nom_court.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />
      )}

      {/* Modal de confirmation de suppression */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={deleteModal.visible}
        onRequestClose={() => setDeleteModal({ visible: false, port: null })}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer la suppression</Text>
            <Text style={styles.modalMessage}>
              Êtes-vous sûr de vouloir supprimer le port "{deleteModal.port?.nom}" ?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModal({ visible: false, port: null })}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={performDelete}
              >
                <Text style={styles.modalButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de succès pour la suppression */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={successModal}
        onRequestClose={() => setSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.successModalContent}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Succès !</Text>
            <Text style={styles.successMessage}>
              Le port a été supprimé avec succès
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
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
    marginBottom: 20,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#17a2b8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 8,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 12,
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
  description: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    flex: 1,
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
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  successModalContent: {
    width: '70%',
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
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
