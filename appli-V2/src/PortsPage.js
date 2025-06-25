import { API_BASE_URL } from './config';
import { IMAGES_URL } from './config';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PortsPage () {
    const [port, setPort] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const navigation = useNavigation();

      useEffect(() => {
          const fetchPort = async () => {
            console.log('Début du chargement des ports...'); // Debug
            try {
              const response = await fetch(`${API_BASE_URL}/ports`);
              console.log('Réponse ports:', response.status); // Debug
              if (response.status === 200) {
                const data = await response.json();
                console.log('Données ports reçues:', data); // Debug
                setPort(data);
              } else {
                console.error('Erreur API ports:', response.status); // Debug
                Alert.alert('Erreur', 'Impossible de charger les ports');
              }
            } catch (error) {
              console.error('Erreur de connexion ports:', error); // Debug
              Alert.alert('Erreur', 'Erreur de connexion');
            } finally {
              setIsLoading(false);
            }
          };
      
          fetchPort();
        }, []);

        if (isLoading) {
            return (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Chargement des ports...</Text>
              </View>
            );
          }

          const renderItem = ({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('PortDetails', { port: item.nom_court })}>
                <View style={styles.card}>
                  <Image
                    source={{ uri: `${IMAGES_URL}/ports/${item.photo}` }}
                    style={styles.photo}
                  />
                  <View style={styles.infoContainer}>
                    <Text style={styles.nom}>{item.nom_court}</Text>
                    <Text style={styles.details}>{item.nom}</Text>
                    <Text style={styles.details}>{item.adresse}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );

            return (
                <View style={styles.container}>
                  <Text style={styles.title}>⚓ Nos ports</Text>
                  <Text style={styles.subtitle}>Découvrez nos destinations</Text>
                  {port.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>Aucun port disponible</Text>
                    </View>
                  ) : (
                    <FlatList
                      data={port}
                      keyExtractor={item => item.nom_court.toString()}
                      renderItem={renderItem}
                      contentContainerStyle={{ paddingBottom: 20 }}
                      showsVerticalScrollIndicator={false}
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
              list: {
                flex: 1,
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
                flexDirection: 'row',
                backgroundColor: 'white',
                borderRadius: 12,
                marginVertical: 8,
                padding: 12,
                elevation: 2,
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
            });
