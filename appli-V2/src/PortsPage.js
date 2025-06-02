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
            try {
              const response = await fetch('${API_BASE_URL}/ports');
              if (response.status === 200) {
                const data = await response.json();
                setPort(data);
              } else {
                Alert.alert('Erreur', 'Impossible de charger les ports');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Erreur de connexion');
            } finally {
              setIsLoading(false);
            }
          };
      
          fetchPort();
        }, []);

        if (isLoading) {
            return (
              <View style={styles.container}>
                <ActivityIndicator size="large" color="#00BF6D" />
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
                  <FlatList
                    data={port}
                    keyExtractor={item => item.nom_court.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                  />
                </View>
              );
            }
            
            const styles = StyleSheet.create({
              container: {
                flex: 1,
                backgroundColor: 'white',
                padding: 8,
              },
              card: {
                flexDirection: 'row',
                backgroundColor: '#F5F5F5',
                borderRadius: 10,
                marginVertical: 8,
                padding: 10,
                elevation: 2,
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
              },
              details: {
                fontSize: 12,
                color: '#666',
              },
            });
