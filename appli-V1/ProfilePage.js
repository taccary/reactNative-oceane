import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const response = await fetch('https://solid-robot-w99677j797j2v459-8000.app.github.dev/API/userInfo', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setProfile({
            id: data.user.id || 'ID non disponible',
            fullname: data.user.fullname || 'Nom complet non disponible',
            phone: data.user.phone || '000',
            email: data.user.email || 'Email non disponible',
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
      <Image source={{ uri: 'https://i.postimg.cc/cCsYDjvj/user-2.png' }} style={styles.profilePic} />
      <Text style={styles.name}>{profile.fullname}</Text>
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
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
});