import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../contexts/AuthContext';
import LoginPage from '../screens/LoginPage';
import MenuPage from '../screens/MenuPage';
import ProfilePage from '../screens/ProfilePage';
import LogoutPage from '../screens/LogoutPage';

const Stack = createStackNavigator();

export default function AppNavigator() {
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