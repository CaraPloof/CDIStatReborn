# CDIStat Reborn
## Le meilleur logiciel de statistiques pour un CDI.

CDIStat Reborn est une application de gestion de statistiques conçue spécifiquement pour les Centres de Documentation et d'Information (CDI) des établissements scolaires. Cette application permet de suivre et d'analyser diverses données liées à la fréquentation et à l'utilisation du CDI par les élèves.

### Fonctionnalités principales :
- Enregistrement des élèves : Les élèves peuvent s'enregistrer dans le système en indiquant leur nom, prénom et classe.
- Suivi de la fréquentation : CDIStat Reborn permet de suivre la fréquentation du CDI en enregistrant les passages des élèves.
- Raisons de visite : Les élèves peuvent fournir une raison pour leur visite au CDI, ce qui permet de mieux comprendre les besoins des utilisateurs.
- Statistiques détaillées : L'application génère des statistiques détaillées sur la fréquentation, les raisons de visite, etc., pour aider le personnel du CDI à prendre des décisions informées.

### Installation et utilisation :
1. Cloner ce dépôt sur votre machine locale.
2. Assurez-vous d'avoir Node.js installé sur votre machine.
3. Exécutez `npm install` pour installer les dépendances nécessaires.
4. Assurez-vous d'avoir un fichier CSV contenant les informations des élèves (nom, prénom, classe) dans le répertoire du projet (students.csv).
5. Modifiez le fichier `config.json` pour configurer les paramètres de l'application selon vos besoins.
6. Lancez l'application en exécutant `npm start`.
7. Accédez à l'application via votre navigateur à l'adresse http://localhost:8080.

### Configuration :
Lors du premier lancement de CDIStat Reborn, une configuration assistée sera démarrée.
En case de besoins, modifiez le fichier `config.json`.

### Technologies utilisées :
- Node.js
- Express.js
- EJS (Embedded JavaScript) pour les vues
- CSV Parser pour la manipulation des fichiers CSV
- Une base de donnée no-sql basé sur un système d'indexation de json réalisé par [DIDELOT Tim](https://github.com/CaraPloof) pour [Fossnote](https://github.com/CaraPloof/fossnote)

### Contributeurs :
- [DIDELOT Tim](https://github.com/CaraPloof)

### Licence :
Ce projet est sous licence [MIT](https://github.com/CaraPloof/CDIStatReborn/blob/main/LICENSE).
