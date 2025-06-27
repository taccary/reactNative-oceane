import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { isLoggedIn, getUserData, logout } from './authUtils';

export default function MenuPage() {
  const navigation = useNavigation();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Vérifier l'état de connexion à chaque fois que la page est active
  useFocusEffect(
    React.useCallback(() => {
      const checkAuthStatus = async () => {
        const loggedIn = await isLoggedIn();
        setUserLoggedIn(loggedIn);
        
        if (loggedIn) {
          const user = await getUserData();
          console.log('Données utilisateur récupérées:', user); // Debug
          setUserData(user);
        } else {
          setUserData(null);
        }
      };

      checkAuthStatus();
    }, [])
  );

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setUserLoggedIn(false);
      setUserData(null);
    }
  };

  // Menu pour utilisateur NON connecté
  const renderGuestMenu = () => (
    <View style={styles.menuContainer}>
      <Text style={styles.subtitle}>Accès public</Text>
      
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>🔑 Connexion</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Bateaux')}
      >
        <Text style={styles.buttonText}>🚢 Liste des bateaux</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Ports')}
      >
        <Text style={styles.buttonText}>⚓ Liste des ports</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Secteurs')}
      >
        <Text style={styles.buttonText}>🗺️ Liste des secteurs</Text>
      </TouchableOpacity>
    </View>
  );

  // Menu pour utilisateur CONNECTÉ
  const renderUserMenu = () => {
    // Fonction pour obtenir le nom d'affichage
    const getDisplayName = () => {
      console.log('userData dans getDisplayName:', userData); // Debug supplémentaire
      
      if (!userData) return 'Utilisateur';
      
      // Maintenant userData devrait être un objet structuré
      return userData.name || 
             userData.username || 
             userData.firstName || 
             userData.first_name || 
             userData.email?.split('@')[0] || 
             userData.email || 
             'Utilisateur';
    };

    return (
      <View style={styles.menuContainer}>
        <Text style={styles.subtitle}>
          Bienvenue {getDisplayName()} !
        </Text>
      
      <Text style={styles.sectionTitle}>📋 Consultation</Text>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Bateaux')}
      >
        <Text style={styles.buttonText}>🚢 Liste des bateaux</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Ports')}
      >
        <Text style={styles.buttonText}>⚓ Liste des ports</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Secteurs')}
      >
        <Text style={styles.buttonText}>🗺️ Liste des secteurs</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>⚙️ Gestion</Text>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('BateauxCRUD')}
      >
        <Text style={styles.buttonText}>🔧 Gérer les bateaux (CRUD)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('PortsCRUD')}
      >
        <Text style={styles.buttonText}>⚓ Gérer les ports (CRUD)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('SecteursCRUD')}
      >
        <Text style={styles.buttonText}>🗺️ Gérer les secteurs (CRUD)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.menuButton, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <Text style={[styles.buttonText, styles.logoutButtonText]}>🚪 Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Menu</Text>
      
      {userLoggedIn ? renderUserMenu() : renderGuestMenu()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  logo: {
    height: 80,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  menuContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    marginTop: 30,
  },
  logoutButtonText: {
    fontWeight: 'bold',
  },
});