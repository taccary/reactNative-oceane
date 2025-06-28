// Test de diagnostic pour la route DELETE de l'API des ports
const API_BASE_URL = 'http://172.20.0.1:8000/api'; // Remplacez par votre URL

async function testDeleteAPI() {
  console.log('🧪 Test de diagnostic de la route DELETE des ports');
  console.log('🌐 URL de base API:', API_BASE_URL);
  
  // Test avec différents formats de nom_court
  const testCases = [
    'Le Palais',
    'Le%20Palais',
    encodeURIComponent('Le Palais'),
    'nice',
    'NICE'
  ];
  
  for (const nomCourt of testCases) {
    console.log(`\n📋 Test avec nom_court: "${nomCourt}"`);
    console.log(`🔗 URL complète: ${API_BASE_URL}/ports/${nomCourt}`);
    
    try {
      const response = await fetch(`${API_BASE_URL}/ports/${nomCourt}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Ajoutez ici votre token d'authentification si nécessaire
          // 'Authorization': 'Bearer YOUR_TOKEN'
        },
      });
      
      console.log(`📊 Status: ${response.status}`);
      console.log(`📊 Status Text: ${response.statusText}`);
      
      const responseText = await response.text();
      console.log(`📄 Réponse brute:`, responseText);
      
      if (responseText) {
        try {
          const jsonData = JSON.parse(responseText);
          console.log(`📋 JSON parsé:`, jsonData);
        } catch (e) {
          console.log(`⚠️  Réponse non-JSON`);
        }
      }
      
    } catch (error) {
      console.error(`❌ Erreur réseau:`, error.message);
    }
    
    console.log('─'.repeat(50));
  }
}

// Lancer le test
testDeleteAPI().catch(console.error);
