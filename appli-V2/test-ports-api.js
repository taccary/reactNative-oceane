// Script de test pour vérifier la structure des données des ports
const { API_BASE_URL } = require('./src/config');

async function testPortsAPI() {
  console.log('🧪 Test de l\'API des ports...\n');
  
  try {
    console.log('📡 Appel de l\'API:', `${API_BASE_URL}/ports`);
    const response = await fetch(`${API_BASE_URL}/ports`);
    console.log('📊 Status de la réponse:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📄 Nombre de ports:', data.length);
      
      if (data.length > 0) {
        console.log('\n🔍 Structure du premier port:');
        const firstPort = data[0];
        console.log('Clés disponibles:', Object.keys(firstPort));
        console.log('Données complètes:', JSON.stringify(firstPort, null, 2));
        
        // Vérifier spécifiquement l'ID
        if (firstPort.id) {
          console.log('✅ ID trouvé:', firstPort.id, '(type:', typeof firstPort.id, ')');
        } else {
          console.log('❌ Pas d\'ID trouvé - utilisation de nom_court');
        }
      } else {
        console.log('⚠️ Aucun port trouvé dans la réponse');
      }
    } else {
      console.log('❌ Erreur API:', response.status);
    }
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

// Exécuter le test si ce fichier est appelé directement
if (require.main === module) {
  testPortsAPI();
}

module.exports = { testPortsAPI };
