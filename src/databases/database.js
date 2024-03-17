const fs = require('fs');

// Fonction pour charger la base de données ou la créer si elle n'existe pas
function loadOrCreateDatabase() {
    try {
        const data = fs.readFileSync("database.json");
        return JSON.parse(data);
    } catch (err) {
        console.error('La base de données n\'existe pas ou est vide. Une nouvelle base de données sera créée.');
        return {};
    }
}

// Sauvegarder la base de données dans le fichier JSON
function saveDatabase(database) {
    try {
        const data = JSON.stringify(database, null, 2);
        fs.writeFileSync('database.json', data, 'utf8');
        console.log('Base de données sauvegardée avec succès.');
    } catch (err) {
        console.error('Erreur lors de la sauvegarde de la base de données :', err);
    }
}

// Créer une nouvelle table
function createTable(tableName, columns) {
    const database = loadOrCreateDatabase();
    if (!database[tableName]) {
        database[tableName] = [];
        database[tableName + '_counter'] = 0; // Compteur pour l'ID auto-incrémenté
        database[tableName + '_columns'] = columns;
        saveDatabase(database);
        console.log(`Table '${tableName}' créée avec succès.`);
    } else {
        console.error(`La table '${tableName}' existe déjà.`);
    }
}

// Ajouter un enregistrement à une table
function addToTable(tableName, record) {
    const database = loadOrCreateDatabase();
    if (!database[tableName]) {
        console.error(`La table '${tableName}' n'existe pas.`);
        return;
    }
    const columns = database[tableName + '_columns'];
    if (!columns) {
        console.error(`Les colonnes de la table '${tableName}' ne sont pas définies.`);
        return;
    }

    // Génère automatiquement l'ID en utilisant le compteur
    const id = database[tableName + '_counter']++;
    // Assurez-vous que les colonnes de l'enregistrement correspondent aux colonnes de la table
    const recordKeys = Object.keys(record);
    if (recordKeys.length !== columns.length || !columns.every(col => recordKeys.includes(col))) {
        console.error(`L'enregistrement ne correspond pas aux colonnes de la table '${tableName}'.`);
        return;
    }
    record.id = id;

    database[tableName].push(record);
    saveDatabase(database);
}

// Rechercher un enregistrement spécifique dans une table
function searchInTable(tableName, query) {
    const database = loadOrCreateDatabase();
    if (database[tableName]) {
        if (query && typeof query === 'object') {
            return database[tableName].filter(record => {
                // Vérifiez chaque attribut de l'enregistrement par rapport aux critères de recherche
                for (const key in query) {
                    if (record[key] !== query[key]) {
                        return false;
                    }
                }
                return true;
            });
        } else {
            console.error('La requête de recherche doit être un objet.');
            return [];
        }
    } else {
        console.error(`La table '${tableName}' n'existe pas.`);
        return [];
    }
}

// Fonction pour éditer un élément dans une table en utilisant son ID
function editElementInTable(tableName, elementId, newData) {
    const database = loadOrCreateDatabase();
    if (!database[tableName]) {
        console.error(`La table '${tableName}' n'existe pas.`);
        return;
    }
    const record = database[tableName].find(record => record.id === elementId);
    if (!record) {
        console.error(`Aucun élément trouvé avec l'ID ${elementId} dans la table '${tableName}'.`);
        return;
    }
    // Mettre à jour les données de l'élément avec les nouvelles données
    Object.assign(record, newData);
    saveDatabase(database);
}

module.exports = {
    createTable,
    addToTable,
    searchInTable,
    loadOrCreateDatabase,
    saveDatabase,
    editElementInTable
};