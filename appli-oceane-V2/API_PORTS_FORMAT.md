# 📋 Structure JSON pour l'API des ports

## Format attendu par l'API pour la création d'un port :

```json
{
  "nom_court": "Le Palais",
  "nom": "Gare maritime de Le Palais",
  "description": "La gare maritime de Le Palais est ouverte toute l'année de 08h30 à 12h15 et de 14h00 à 18h00.",
  "adresse": "Quai Bonnelle 56360 Le Palais",
  "photo": "le-palais.jpg",
  "camera": "https://pv.viewsurf.com/id/848/a/media/c/4416?i=Njk0ODp1bmRlZmluZWQ"
}
```

## Format attendu par l'API pour la modification d'un port :

**Route:** `PUT /ports/{nom_court}`

**Paramètre URL:** Le `nom_court` du port à modifier

**Body JSON:** (sans le nom_court car il est dans l'URL)
```json
{
  "nom": "Gare maritime de Le Palais",
  "description": "La gare maritime de Le Palais est ouverte toute l'année de 08h30 à 12h15 et de 14h00 à 18h00.",
  "adresse": "Quai Bonnelle 56360 Le Palais",
  "photo": "le-palais.jpg",
  "camera": "https://pv.viewsurf.com/id/848/a/media/c/4416?i=Njk0ODp1bmRlZmluZWQ"
}
```

## Format attendu par l'API pour la suppression d'un port :

**Route:** `DELETE /ports/{nom_court}`

**Paramètre URL:** Le `nom_court` du port à supprimer

## ✅ Champs mis à jour dans l'application :

### Champs obligatoires :
- **nom_court** : Identifiant court du port
- **nom** : Nom complet du port 
- **description** : Description détaillée avec horaires et services
- **adresse** : Adresse complète du port
- **photo** : Nom du fichier image

### Champs optionnels :
- **camera** : URL de la caméra du port

## 🔧 Pages mises à jour :

1. **PortsPageAjout.js** : Formulaire d'ajout avec tous les champs
2. **PortsPageModif.js** : Formulaire de modification (nom_court non modifiable)
3. **PortsCRUDPage.js** : Affichage de la description dans la liste

## 📱 Interface utilisateur :

- **Ajout** : Tous les champs modifiables
  - Modal de succès personnalisé avec fermeture automatique (3s)
  - Alert natif en complément
  - Logs de debug pour diagnostic
  - Réinitialisation du formulaire après succès
- **Modification** : Champ nom_court en lecture seule (grisé)
  - Modal de confirmation avant soumission
  - Modal de succès avec nom du port et redirection automatique (3s)
  - Logs de debug pour vérifier l'envoi des données
  - Redirection automatique vers la page CRUD
- **Suppression** : Utilise le nom_court comme identifiant
  - Modal de confirmation avec nom du port
  - Modal de succès après suppression avec fermeture automatique (2s)
  - Rechargement automatique de la liste
- Champ "Description" avec TextArea multi-lignes (4 lignes)
- Champ "Caméra" optionnel avec placeholder URL
- Validation obligatoire pour description
- Affichage de la description tronquée (2 lignes max) dans la liste CRUD

## 🔍 Gestion des identifiants :

- **Création** : Envoie tous les champs incluant nom_court
- **Modification** : Utilise nom_court comme paramètre URL, n'envoie que les champs modifiables
- **Suppression** : Utilise nom_court comme paramètre URL

L'application est maintenant compatible avec la structure JSON de votre API !
