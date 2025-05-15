import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { setIsLoggedIn } = useContext(AuthContext);

  const login = async () => {
    try {
      const response = await fetch('https://solid-robot-w99677j797j2v459-8000.app.github.dev/API/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email,
          password,
        }).toString(),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (response.status === 200) {
        const data = JSON.parse(responseText);
        if (data.status === 'success') {
          await AsyncStorage.setItem('jwt', data.token);
          console.log('Login successful, setting isLoggedIn to true');
          setIsLoggedIn(true); // Met à jour l'état de connexion et déclenche le rendu de AppNavigator ce qui redirige vers l'écran de menu
        } else {
          Alert.alert('Erreur', data.message || 'Erreur de connexion');
        }
      } else if (response.status === 401) {
        Alert.alert('Erreur', 'Email ou mot de passe incorrect');
      } else {
        Alert.alert('Erreur', 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Erreur', 'Erreur de connexion');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Connexion</Text>
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
      <Button title="Se connecter" onPress={login} color="#00BF6D" />
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