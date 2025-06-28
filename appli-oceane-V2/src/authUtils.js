import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

// Récupérer le token JWT stocké
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    return token;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};

// Récupérer les données utilisateur stockées
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur:', error);
    return null;
  }
};

// Vérifier si l'utilisateur est connecté
export const isLoggedIn = async () => {
  const token = await getToken();
  return token !== null;
};

// Faire une requête authentifiée avec le token JWT
export const authenticatedFetch = async (url, options = {}) => {
  const token = await getToken();
  
  if (!token) {
    throw new Error('Token d\'authentification non trouvé');
  }

  const authenticatedOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  return fetch(url, authenticatedOptions);
};

// Déconnexion (supprimer les données stockées)
export const logout = async () => {
  try {
    await AsyncStorage.removeItem('jwt_token');
    await AsyncStorage.removeItem('user_data');
    return true;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    return false;
  }
};

// Vérifier si le token est encore valide
export const validateToken = async () => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/auth/validate`);
    return response.ok;
  } catch (error) {
    console.error('Erreur lors de la validation du token:', error);
    return false;
  }
};

// Récupérer les données utilisateur fraîches depuis l'API
export const refreshUserData = async () => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/me`);
    if (response.ok) {
      const userData = await response.json();
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      return userData;
    } else {
      console.error('Erreur lors du rafraîchissement des données utilisateur');
      return null;
    }
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des données utilisateur:', error);
    return null;
  }
};
