import { API_BASE_URL } from './config';
import { IMAGES_URL } from './config';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SecteursPage() {
  const [secteurs, setSecteurs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchSecteurs();
  }, []);

  const fetchSecteurs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/secteurs`);
      if (response.status === 200) {
        const data = await response.json();
        setSecteurs(data);
      } else {
        Alert.alert('Erreur', 'Impossible de charger les secteurs');
      }
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#17a2b8" />
        <Text style={styles.loadingText}>Chargement des secteurs...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('SecteurDetails', { secteur: item.id })}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: `${IMAGES_URL}/secteurs/${item.photo}` }}
          style={styles.photo}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.nom}>{item.nom}</Text>
          <Text style={styles.details}>Code: {item.code}</Text>
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗺️ Nos secteurs</Text>
      <Text style={styles.subtitle}>Découvrez nos zones de navigation</Text>
      
      {secteurs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun secteur disponible</Text>
        </View>
      ) : (
        <FlatList
          data={secteurs}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={true}
          style={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    ...Platform.select({
      web: {
        height: '100vh',
        overflow: 'hidden',
      },
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 8,
    padding: 12,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#DDD',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nom: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  details: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    fontStyle: 'italic',
  },
  list: {
    flex: 1,
    ...Platform.select({
      web: {
        minHeight: '100%',
        overflow: 'auto',
      },
    }),
  },
});
