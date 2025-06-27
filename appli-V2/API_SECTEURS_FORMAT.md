# 🗺️ Gestion des secteurs - Documentation API

## Format attendu par l'API pour la création d'un secteur :

```json
{
  "nom": "Secteur Nord",
  "photo": "nord.jpg",
  "description": "Secteur desservant la partie nord.",
  "url": "https://oceane.fr/secteur/nord"
}
```

## Format attendu par l'API pour la modification d'un secteur :

**Route:** `PUT /secteurs/{id}`

**Paramètre URL:** L'`id` du secteur à modifier

**Body JSON:**
```json
{
  "nom": "Secteur Nord",
  "photo": "nord.jpg",
  "description": "Secteur desservant la partie nord.",
  "url": "https://oceane.fr/secteur/nord"
}
```

## Format attendu par l'API pour la suppression d'un secteur :

**Route:** `DELETE /secteurs/{id}`

**Paramètre URL:** L'`id` du secteur à supprimer

## ✅ Champs des secteurs :

### Champs obligatoires :
- **nom** : Nom complet du secteur
- **description** : Description détaillée du secteur
- **photo** : Nom du fichier image
- **url** : URL complète vers la page du secteur

## 🔧 Pages créées :

1. **SecteursPage.js** : Page de consultation publique des secteurs
2. **SecteursCRUDPage.js** : Page de gestion CRUD des secteurs (protégée)
3. **SecteursPageAjout.js** : Formulaire d'ajout de secteur
4. **SecteursPageModif.js** : Formulaire de modification de secteur

## 📱 Interface utilisateur :

### **Consultation publique** (`SecteursPage.js`) :
- Liste de tous les secteurs avec images
- Affichage du nom, code et description
- Navigation vers les détails (à implémenter)
- Accessible sans authentification

### **Gestion CRUD** (`SecteursCRUDPage.js`) :
- **Authentification requise** pour accéder
- Liste avec boutons d'action (Modifier/Supprimer)
- Modal de confirmation pour suppression
- Modal de succès après suppression avec fermeture automatique (2s)
- Bouton d'ajout en haut de page
- Scroll optimisé pour web et mobile

### **Ajout** (`SecteursPageAjout.js`) :
- Formulaire complet avec tous les champs obligatoires (nom, description, photo, url)
- Validation des champs avant soumission
- Modal de succès avec fermeture automatique (3s)
- Alert natif en complément
- Réinitialisation du formulaire après succès
- Redirection automatique vers la page CRUD

### **Modification** (`SecteursPageModif.js`) :
- Chargement automatique des données existantes
- Modal de confirmation avant soumission
- Modal de succès avec nom du secteur et redirection automatique (3s)
- Validation des champs modifiés (nom, description, photo, url)
- Redirection automatique vers la page CRUD

## 🔍 Gestion des identifiants :

- **Création** : Envoie tous les champs dans le body JSON
- **Modification** : Utilise l'ID comme paramètre URL, envoie tous les champs modifiables
- **Suppression** : Utilise l'ID comme paramètre URL

## 🌐 Compatibilité multiplateforme :

L'application fonctionne parfaitement sur :
- **📱 Mobile** (iOS/Android) : Scroll natif optimisé avec FlatList
- **🌐 Web** : Scroll avec div HTML natif, barre de défilement stylée

## 🎨 Design cohérent :

- **Couleur principale** : Vert #28a745 (différent des ports #17a2b8)
- **Icônes** : 🗺️ pour toutes les pages secteurs
- **Modals** : Style uniforme avec les autres modules
- **Navigation** : Intégrée au menu principal

## 🔗 Navigation :

### Menu public :
- **"🗺️ Liste des secteurs"** → `SecteursPage.js`

### Menu utilisateur connecté :
- **"🗺️ Liste des secteurs"** → `SecteursPage.js` (consultation)
- **"🗺️ Gérer les secteurs (CRUD)"** → `SecteursCRUDPage.js` (gestion)

### Routes configurées :
- `Secteurs` → Page de consultation
- `SecteursCRUD` → Page de gestion CRUD
- `AjoutSecteurs` → Formulaire d'ajout
- `ModifSecteurs` → Formulaire de modification

## 🧪 Tests :

✅ **15 pages** compilent correctement  
✅ Aucune erreur de syntaxe  
✅ Navigation intégrée  
✅ Styles cohérents  
✅ Scroll web optimisé  

Les secteurs sont maintenant parfaitement intégrés à l'application ! 🎉
