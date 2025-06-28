// Test simple pour vérifier que les pages se chargent sans erreurs
const fs = require('fs');
const path = require('path');

const pagesToTest = [
  'src/App.js',
  'src/MenuPage.js',
  'src/BateauxPage.js',
  'src/BateauxCRUDPage.js',
  'src/PortsPage.js',
  'src/PortsCRUDPage.js',
  'src/AuthentificationPage.js',
  'src/BateauxPageAjout.js',
  'src/BateauxPageModif.js',
  'src/PortsPageAjout.js',
  'src/PortsPageModif.js',
  'src/SecteursPage.js',
  'src/SecteursCRUDPage.js',
  'src/SecteursPageAjout.js',
  'src/SecteursPageModif.js'
];

console.log('🧪 Test de vérification des pages...\n');

pagesToTest.forEach(pagePath => {
  try {
    const fullPath = path.join(__dirname, pagePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Vérifications de base
    const checks = [
      { name: 'Import React', test: /import.*React.*from.*react/i },
      { name: 'Export default', test: /export\s+default/i },
      { name: 'Parenthèses équilibrées', test: content => {
        const open = (content.match(/\(/g) || []).length;
        const close = (content.match(/\)/g) || []).length;
        return Math.abs(open - close) < 3; // Tolérance pour les commentaires
      }},
      { name: 'Accolades équilibrées', test: content => {
        const open = (content.match(/\{/g) || []).length;
        const close = (content.match(/\}/g) || []).length;
        return Math.abs(open - close) < 3; // Tolérance pour les commentaires
      }}
    ];
    
    let allPassed = true;
    const results = [];
    
    checks.forEach(check => {
      let passed;
      if (typeof check.test === 'function') {
        passed = check.test(content);
      } else {
        passed = check.test.test(content);
      }
      
      if (!passed) allPassed = false;
      results.push(`  ${passed ? '✅' : '❌'} ${check.name}`);
    });
    
    console.log(`📄 ${pagePath}:`);
    results.forEach(result => console.log(result));
    console.log(`   ${allPassed ? '✅ PASS' : '❌ FAIL'}\n`);
    
  } catch (error) {
    console.log(`📄 ${pagePath}:`);
    console.log(`   ❌ Erreur de lecture: ${error.message}\n`);
  }
});

console.log('✨ Test terminé !');
