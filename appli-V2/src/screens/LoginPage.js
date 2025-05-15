import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { login } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const { status, data } = await login(email, password);

      if (status === 200 && data.status === 'success') {
        setIsLoggedIn(true); // Met à jour l'état de connexion et déclenche le rendu de AppNavigator ce qui redirige vers l'écran de menu
      } else {
        Alert.alert('Erreur', data.message || 'Erreur de connexion');
      }
    } catch (error) {
      if (error.message === 'Request timed out') {
        Alert.alert('Erreur', 'La requête a expiré. Veuillez réessayer.');
      } else {
        Alert.alert('Erreur', 'Erreur de connexion au serveur.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Connexion appli V2</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={handleLogin} color="#00BF6D" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginVertical: 10,
    backgroundColor: '#F5FCF9',
  },
});