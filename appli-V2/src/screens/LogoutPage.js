import React, { useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { logout } from '../services/api';

export default function LogoutPage() {
  const { setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const handleLogout = async () => {
      await logout();
      setIsLoggedIn(false); // Met à jour l'état de connexion
    };
    handleLogout(); // Appel de la fonction handleLogout lorsque le composant est monté
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