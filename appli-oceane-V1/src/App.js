import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuPage from './MenuPage';
import BateauxPage from './BateauxPage';
import BateauDetailsPage from './BateauDetailsPage'; // Ajout

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Menu" component={MenuPage} />
        <Stack.Screen name="Bateaux" component={BateauxPage} options={{ title: 'Nos bateaux' }}/>
        <Stack.Screen name="BateauDetails" component={BateauDetailsPage} options={{ title: 'Détail du bateau' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}