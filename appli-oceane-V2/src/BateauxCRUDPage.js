import { API_BASE_URL } from './config';
import { IMAGES_URL } from './config';
import { authenticatedFetch, isLoggedIn } from './authUtils';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, Modal } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function BateauxCRUDPage() {
  const [bateaux, setBateaux] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ visible: false, bateau: null });
  const navigation = useNavigation();

  // Vérifier l'authentification à chaque fois que la page devient active
  useFocusEffect(
    React.useCallback(() => {
      const checkAuthAndFetch = async () => {
        const loggedIn = await isLoggedIn();
        if (!loggedIn) {
          Alert.alert(
            'Authentification requise', 
            'Vous devez être connecté pour accéder à la gestion des bateaux',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Login')
              }
            ]
          );
          return;
        }
        fetchBateaux();
      };

      checkAuthAndFetch();
    }, [])
  );

  const fetchBateaux = async () => {
    setIsLoading(true);
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

  const handleDelete = (bateauId, bateauNom) => {
    setDeleteModal({ visible: true, bateau: { id: bateauId, nom: bateauNom } });
  };

  const performDelete = async () => {
    const { id, nom } = deleteModal.bateau;
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/bateaux/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        Alert.alert('Succès', 'Le bateau a été supprimé avec succès');
        setDeleteModal({ visible: false, bateau: null });
        fetchBateaux(); // Recharger la liste
      } else if (response.status === 401) {
        Alert.alert('Session expirée', 'Veuillez vous reconnecter');
        navigation.navigate('Login');
      } else {
        const data = await response.json();
        Alert.alert('Erreur', data.message || 'Erreur lors de la suppression');
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des bateaux...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.cardContent}
        onPress={() => navigation.navigate('BateauDetails', { bateau: item.id })}
      >
        <Image
          source={{ uri: `${IMAGES_URL}/bateaux/${item.photo}` }}
          style={styles.photo}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.nom}>{item.nom}</Text>
          <Text style={styles.details}>Longueur : {item.longueur} m | Largeur : {item.largeur} m</Text>
          <Text style={styles.details}>Vitesse : {item.vitesse_croisiere} nœuds | Niveau PMR : {item.niveauPMR}</Text>
        </View>
      </TouchableOpacity>
      
      {/* Boutons d'action */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('ModifBateaux', { bateau: item.id })}
        >
          <Text style={styles.actionButtonText}>✏️ Modifier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id, item.nom)}
        >
          <Text style={styles.actionButtonText}>🗑️ Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des bateaux</Text>
      
      {/* Bouton d'ajout en haut */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AjoutBateaux')}
      >
        <Text style={styles.addButtonText}>➕ Ajouter un nouveau bateau</Text>
      </TouchableOpacity>

      <FlatList
        data={bateaux}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />

      {/* Modal de confirmation de suppression */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={deleteModal.visible}
        onRequestClose={() => setDeleteModal({ visible: false, bateau: null })}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmer la suppression</Text>
            <Text style={styles.modalMessage}>
              Êtes-vous sûr de vouloir supprimer le bateau "{deleteModal.bateau?.nom}" ?
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModal({ visible: false, bateau: null })}
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
    backgroundColor: '#28a745',
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
});
