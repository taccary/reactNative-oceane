import React, { useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './AuthContext';

export default function LogoutPage() {
  const navigation = useNavigation();
  const { setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.removeItem('jwt');
      setIsLoggedIn(false); // Met à jour l'état de connexion ce qui déclenche le rendu de AppNavigator et redirige vers l'écran de connexion
    };
    logout(); // Appel de la fonction logout lorsque le composant est monté
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Déconnexion</Text>
      <ActivityIndicator size="large" color="#00BF6D" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});