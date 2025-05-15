import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfilePage from './ProfilePage';
import LogoutPage from './LogoutPage';

export default function MenuPage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Menu</Text>
      <Button
        title="Profil"
        onPress={() => navigation.navigate('Profile')}
        color="#00BF6D"
      />
      <Button
        title="Déconnexion"
        onPress={() => navigation.navigate('Logout')}
        color="#00BF6D"
      />
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
});