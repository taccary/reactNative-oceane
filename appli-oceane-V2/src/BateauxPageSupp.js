import { API_BASE_URL } from './config';
import { IMAGES_URL } from './config';
import { authenticatedFetch, isLoggedIn } from './authUtils';
import React, {useEffect,useState } from 'react';
import { View, Text, Button, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BateauxPageSupp({ route }) {
    const bateauId = route.params.bateau;
    const [bateau, setBateau] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const checkAuthAndFetch = async () => {
          // Vérifier l'authentification
          const loggedIn = await isLoggedIn();
          if (!loggedIn) {
            Alert.alert(
              'Authentification requise', 
              'Vous devez être connecté pour supprimer un bateau',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Login')
                }
              ]
            );
            return;
          }

          // Récupérer les données du bateau
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
          } finally {
            setIsLoading(false);
          }
        };
    
        checkAuthAndFetch();
      }, [bateauId, navigation]);

      const handleSubmit = async () => {
      // Vérifier l'authentification avant la suppression
      const loggedIn = await isLoggedIn();
      if (!loggedIn) {
        Alert.alert('Non authentifié', 'Veuillez vous connecter pour supprimer un bateau');
        navigation.navigate('Login');
        return;
      }

      try {
          const response = await authenticatedFetch(`${API_BASE_URL}/bateaux/${bateauId}`, {
            method: 'DELETE', // Correction: DELETE au lieu de DESTROY
          });
      
          if (response.ok) {
            Alert.alert('Succès', 'Le bateau a été supprimé avec succès');
            navigation.navigate('Bateaux');
          } else if (response.status === 401) {
            Alert.alert('Session expirée', 'Veuillez vous reconnecter');
            navigation.navigate('Login');
          } else {
            const data = await response.json();
            Alert.alert('Erreur', data.message || 'Une erreur est survenue lors de la suppression');
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
  <View>
    {bateau ? (
      <>
        <Text>Souhaitez-vous supprimer le bateau {bateau.nom} ?</Text>
        <Button title="Supprimer" onPress={handleSubmit} color="red" />
        <Button title="Annuler" onPress={() => navigation.navigate('BateauDetails')} color="green" />
      </>
    ) : (
      <Text>Chargement du bateau...</Text>
    )}
  </View>
);

}

function connect() {

}

function unconnect() {

}