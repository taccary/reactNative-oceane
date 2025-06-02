import { API_BASE_URL } from './config';
import { IMAGES_URL } from './config';
import React, {useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BateauxPageAjout() {
    const [id, setID] = useState('');
    const [nom, setNom] = useState('');
    const [desc, setDesc] = useState('');
    const navigation = useNavigation();

    
    const handleSubmit = async () => {
  const idNum = parseInt(id, 10);

  if (!id || isNaN(idNum) || !nom || !desc) {
    Alert.alert('Erreur', 'Veuillez remplir tous les champs correctement');
    return;
  }

  const bateau = {
    id: idNum,
    nom,
    description: desc,
  };

  try {
    const response = await fetch('${API_BASE_URL}/bateaux', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bateau),
    });

    if (response.ok) {
      Alert.alert('Succès', 'Le bateau a été créé avec succès');
      setID('');
      setNom('');
      setDesc('');
      navigation.navigate('Bateaux');
    } else {
      const data = await response.json();
      Alert.alert('Erreur', data.message || 'Une erreur est survenue lors de la création');
    }
  } catch (error) {
    Alert.alert('Erreur', 'Impossible de contacter le serveur');
  }
};

    

    return (
        <View>
            <Text>Identifiant : </Text>
            <TextInput style={styles.input} value={id} onChangeText={setID}/>
            <Text>Nom: </Text>
            <TextInput
                style={styles.input}
                value={nom}
                onChangeText={setNom}
            />
            <Text>Description : </Text>
            <TextInput
                style={styles.input}
                value={desc}
                onChangeText={setDesc}
            />
            <View style={styles.button}>
        <Button title="Envoyer" onPress={handleSubmit} color="#00BF6D" />
      </View>
    </View>

    )
    
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
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
})
