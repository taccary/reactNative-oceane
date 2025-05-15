import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile } from '../services/api';

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    id: '',
    fullname: '',
    phone: '000',
    email: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) {
        Alert.alert('Erreur', 'Token non disponible');
        return;
      }

      try {
        const response = await getUserProfile();
        console.log(response.status);
        if (response.status === 200) {
          const user = response.data.user;
          console.log(user);

          setProfile({
            id: user.id || 'ID non disponible',
            fullname: user.fullname || 'Nom complet non disponible',
            phone: '000',
            email: user.email || 'Email non disponible',
          });
        } else {
          Alert.alert('Erreur', 'Impossible de charger les données du profil');
        }
      } catch (error) {
        Alert.alert('Erreur', 'Erreur de connexion');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00BF6D" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Mes infos</Text>
      <Image source={{ uri: 'https://i.postimg.cc/cCsYDjvj/user-2.png' }} style={styles.photo} />
      <Text style={styles.nom}>{profile.fullname}</Text>
      <Text style={styles.info}>User ID: {profile.id}</Text>
      <Text style={styles.info}>Phone: {profile.phone}</Text>
      <Text style={styles.info}>Email: {profile.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  nom: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
});