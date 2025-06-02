import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuPage from './MenuPage';
import PageLogin from './AuthentificationPage';
import PageLogout from './AuthentificationPage';
import BateauxPage from './BateauxPage';
import BateauDetailsPage from './BateauDetailsPage';
import BateauxPageAjout from './BateauxPageAjout';
import BateauxPageModif from './BateauxPageModif';
import BateauxPageSupp from './BateauxPageSupp';
import PortsPage from './PortsPage';  // Ajout

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Menu" component={MenuPage} />

        <Stack.Screen name="Login" component={PageLogin} options={{title: 'Page de connexion'}}/>
        <Stack.Screen name="Logout" component={PageLogout} options={{title: 'Page de deconnexion'}}/>
        
        <Stack.Screen name="Bateaux" component={BateauxPage} options={{ title: 'Nos bateaux' }}/>
        <Stack.Screen name="BateauDetails" component={BateauDetailsPage} options={{ title: 'Détail du bateau' }} />

        <Stack.Screen name="AjoutBateaux" component={BateauxPageAjout} options={{title: 'Ajouter un bateau'}}/>
        <Stack.Screen name="ModifBateaux" component={BateauxPageModif} options={{title: 'Modifier un bateaux'}}/>
        <Stack.Screen name="SuppBateaux" component={BateauxPageSupp} options={{title: 'Supprimer un bateau'}}/>
        
        <Stack.Screen name="Ports" component={PortsPage} options={{title: 'Nos Ports' }}/>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}