import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MenuPage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Menu</Text>
      <Button style={styles.button} title='Connexion' onPress={() => navigation.navigate('Login')}/>
      <Button style={styles.button} title='Connexion' onPress={() => navigation.navigate('Login')}/>
      <Button style={styles.button} title="Liste des bateaux" onPress={() => navigation.navigate('Bateaux')} />
      <Button style={styles.title} title="Liste des Ports" onPress={() => navigation.navigate('Ports')}/>

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
    height: 80,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});