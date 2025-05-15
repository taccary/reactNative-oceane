import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://friendly-winner-w996774w6rjhggr9-8000.app.github.dev/API'; // mettre à jour la route de l'API

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('jwt');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : undefined,
  };
};

const fetchWithTimeout = (url, options, timeout = 10000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]);
};

export const login = async (email, password) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      email,
      password,
    }).toString(),
  });

  const responseText = await response.text();
  const data = JSON.parse(responseText);

  if (response.status === 200 && data.status === 'success') {
    await AsyncStorage.setItem('jwt', data.token);
  }

  return { status: response.status, data };
};

export const getUserProfile = async () => {
  const headers = await getHeaders();
  const response = await fetchWithTimeout(`${API_BASE_URL}/userInfo`, {
    method: 'GET',
    headers,
  });
  const responseStatus = response.status;
  const responseText = await response.text();
  const data = JSON.parse(responseText);
  return { status: responseStatus, data: data };
};

export const logout = async () => {
  await AsyncStorage.removeItem('jwt');
};