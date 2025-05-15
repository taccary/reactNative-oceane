import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider, AuthContext } from './AuthContext';
import LoginPage from './LoginPage';
import MenuPage from './MenuPage';
import ProfilePage from './ProfilePage';
import LogoutPage from './LogoutPage';

const Stack = createStackNavigator();

function AppNavigator() {
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    console.log('AppNavigator - isLoggedIn:', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Menu" component={MenuPage} />
            <Stack.Screen name="Profile" component={ProfilePage} />
            <Stack.Screen name="Logout" component={LogoutPage} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginPage} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}