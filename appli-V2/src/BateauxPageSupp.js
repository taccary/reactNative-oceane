import { API_BASE_URL } from './config';
import { IMAGES_URL } from './config';
import React, {useEffect,useState } from 'react';
import { View, Text, Button, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BateauxPageSupp({ route }) {
    const bateauId = route.params.bateau;
    const [bateau, setBateau] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
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
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchBateau();
      }, [bateauId]);

      const handleSubmit = async () => {

      try {
          const response = await fetch(`${API_BASE_URL}/bateaux/${bateauId}`, {
            method: 'DESTROY',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bateau),
          });
      
          if (response.ok) {
            Alert.alert('Succès', 'Le bateau a été supprimer avec succès');
            navigation.navigate('Bateaux');
          } else {
            const data = await response.json();
            Alert.alert('Erreur', data.message || 'Une erreur est survenue lors de la suppression');
          }
        } catch (error) {
          Alert.alert('Erreur', 'Impossible de contacter le serveur');
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