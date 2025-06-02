## POC d'appli mobile en React Native avec Expo : consultation d'info via des routes d'API 
:octocat: :iphone:

## Prérequis

Vous aurez besoin de :
- Un compte [GitHub](www.github.com) 
- Un compte [Expo.io](www.expo.io)
- Accès à [GitHub Codespaces](https://github.com/features/codespaces/)
- [Expo installée sur votre appareil mobile](https://expo.io/tools)

## Infos

Ce dépôt contient 1 POC d'application react native qui interroge une API oceane (TP API Océane).
Elle nécessite donc que vous ayez une API qui réponde publiquement sur les end-points demandés dans le code. Il faut également adapter les url et end-points de ce code à ceux servis par votre API.

### Structure de l'application

L'architecture de l'application appli-V1 est un peu basique (affichages et taitements mélangés) et convient pour une petite application. Elle a surtout un usage pédagogique ici.

appli-V1
├── assets/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── logo.png
│   └── splash.png
├── src/
│   ├── App.js
│   ├── BateauDetailsPage.js
│   ├── BateauxPage.js
│   └── MenuPage.js
├── app.json
├── index.js
├── package.json
└── yarn.lock

**Explication de la structure**
- *.expo/ : Dossier généré par Expo qui contient des fichiers de configuration et des données spécifiques à Expo pour le développement de l'application.*
- assets/ : Contient les fichiers d'images et autres ressources statiques.
- *node_modules/ : Dossier généré qui contient toutes les dépendances et modules installés via npm. Ce dossier est généré automatiquement lors de l'installation des dépendances définies dans le fichier `package.json`.*
- src/ : Contient tout le code source de l'application.
    - MenuPage.js et autres pages : pages de l'application.
    - App.js : Point d'entrée principal de l'application.
- index.js : Fichier de démarrage qui enregistre l'application et la rend dans le DOM.
- app.json : Fichier de configuration pour Expo. Il contient des informations sur l'application telles que le nom, l'icône, les permissions, et d'autres paramètres spécifiques à Expo.
- package-lock.json : Ce fichier est généré automatiquement par npm pour verrouiller les versions exactes des dépendances installées dans votre projet. Il garantit que les mêmes versions des paquets seront installées à chaque fois que quelqu'un exécute `npm install`, ce qui assure la cohérence des environnements de développement et de production. Vous ne devez pas modifier ce fichier manuellement.
- package.json : Fichier de configuration principal pour npm. Il contient des informations sur le projet, telles que le nom, la version, les scripts de build, les dépendances et les métadonnées du projet. Ce fichier est édité manuellement par les développeurs pour ajouter ou mettre à jour les dépendances et les scripts.
- yarn.lock : Ce fichier est généré automatiquement par Yarn pour verrouiller les versions exactes des dépendances installées dans votre projet. Il garantit que les mêmes versions des paquets seront installées à chaque fois que quelqu'un exécute `yarn install`, ce qui assure la cohérence des environnements de développement et de production. Vous ne devez pas modifier ce fichier manuellement.

les dossiers .expo et node_modules ne sont pas remontés dans le dépot (gitignore) et sont a construire dans chaque codespace (voir étapes ci-dessous)

## Etapes d'installation de l'environnement dans le codespace

### 1. Lancement d'un espace de code pour ce dépôt

Cliquez sur « Code » et « Ouvrir avec les espaces de code ».

### 2. Installation d'Expo sur votre environnement Codespaces

Expo est un framework et une plateforme pour les applications React universelles qui vous aident à développer, construire, déployer et itérer rapidement sur iOS et Android". On va installer la dernière version du client expo dans le codespace.

Dans le terminal, saisissez :

```
npx expo install expo@latest
```

si la version SDK avec laquelle le projet a été réalisé n'est plus la même, lancer un fix
```
npx expo install --fix
```

### 3. Installation des dépendances dans le dossier de l'application

Dans le terminal, déplacez-vous dans le dossier de l'application pour laquelle vous voulez installer les dépendances :

```
cd appli-V1
```

Lancez l'installation des dépendances nodes liées au projet :

```
npm install
```

Il faudra faire ces manipulations dans chaque dossier d'application

### 4. Connection à Expo

Avant de lancer l'application, pour pouvoir nous y connecter à distance, il faut vous connecter à votre compte Expo. Exécutez simplement la commande suivante et entrez votre nom d'utilisateur et votre mot de passe expo :

```
npx expo login
```

### 5. Démarrer l'application

Démarrez l'application pour la tester sur notre propre appareil mobile. 
Dans le terminal, depuis le dossier de l'application, lancez la commande suivante :

```
npx expo start --tunnel
```

Au premier lancement, il se peut qu'il manque la dépendance @expo/ngrok@^4.1.0. Répondez oui (y) pour l'installer.

Si tout a fonctionné comme prévu, vous devriez voir un code QR. Scannez le code QR ci-dessus avec l'application Expo (Android) ou l'application Appareil photo (iOS). Sur iOS, cela vous invitera à ouvrir Expo sur votre téléphone que vous devriez déjà avoir installé et connecté.

Le premier chargement de l'application peut prendre un peu de temps, et vous devrez peut-être cliquer sur « Recharger JS » si vous obtenez une erreur. En fait, via cette méthode, l'espace de code et votre téléphone se déconnectent assez rapidement, donc si vous voyez un message « Déconnecté du serveur Metro », secouez simplement votre téléphone pour obtenir le menu Expo et cliquez sur « Recharger ». 

**Cette commande servira ensuite pour redémarrer le serveur de développement**


## Tests de l'application

Vous pouvez commencer à modifier le code selon vos besoins. Par exemple, vous pouvez éditer les fichiers dans le dossier `src/` pour apporter des changements à l'application.

Pour recharger l'application après avoir apporté des modifications, enregistrez simplement vos fichiers et l'application se rechargera automatiquement grâce à la fonctionnalité de rechargement en direct d'Expo.
Si vous avez beson de forcer le rechargement, suivez les consignes dans le terminal (r pour recharger l'app).

Si vous loggez des étapes dans le code (console.log()), vous verrez ces logs de débug dans le terminal.


## En plus...

https://docs.expo.dev/tutorial/create-your-first-app/

Si vous voulez créer une nouvelle application "vide", à la place de l'étape 3, il faudra executer la commande :

```
npx create-expo-app@latest monAppli
```

Cette commande va créer un nouveau répertoire de projet nommé monAppli, en utilisant le modèle par défaut. 
Ce modèle contient le code de base essentiel et les bibliothèques nécessaires à la construction de notre application, y compris Expo Router. 


Ensuite dans le dossier de l'appli, 
```
npx expo start
```