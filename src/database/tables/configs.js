const database = require("../database");

const configColumns = ['name', 'value'];
database.createTable('configs', configColumns);

const configExample = {
    name: 'LICENSE',
    value: 'true'
};

async function addConfig(name, value) {
    const config = {
        name,
        value
    };
    try {
        if (database.searchInTable('configs', {name: name}).length === 0) {
            database.addToTable("configs", config);
            console.log(`La configuration ${name} a bien été ajoutée.`);
        }
    } catch (error) {
        console.error('Erreur lors de la création de la configuration :', error);
        throw error;
    }
}

async function getConfig(name) {
    if (database.searchInTable('configs', {name: name}).length > 0) return database.searchInTable('configs', {name: name})[0];
    else return null;
}

async function editConfig(name, newValue) {
    try {
        const existingConfig = await getConfig(name);
        if (existingConfig) {
            const newData = { value: newValue };
            database.editElementByAttribute("configs", "name", name, newData);
            console.log(`La configuration ${name} a été mis à jour avec succès.`);
        } else {
            console.error(`La configuration ${name} n'existe pas dans la base de données des configurations.`);
        }
    } catch (error) {
        console.error('Erreur lors de la modification de la configuration :', error);
        throw error;
    }
}

module.exports = {
    addConfig,
    getConfig,
    editConfig
};