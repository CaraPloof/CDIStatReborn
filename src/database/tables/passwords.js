const database = require("../database");

const classColumns = ['type', 'name', 'pass'];
database.createTable('passwords', classColumns);

const types = ['admin', 'system'];

const passwordUserExample = {
    type: 0, // 0: admin, 1: system
    name: 'profdoc',
    pass: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' // sha256 
};

async function addPassword(type, name, pass) {
    const password = {
        type,
        name,
        pass
    };
    try {
        if (database.searchInTable('passwords', {name: name}).length === 0) {
            database.addToTable("passwords", password);
            console.log(`Le mot de passe [${types[type]}] ${name} bien été ajoutée.`);
        }
    } catch (error) {
        console.error('Erreur lors de la création du mot de passe :', error);
        throw error;
    }
}

async function getPassword(type, name, pass) {
    if (database.searchInTable('passwords', {type: type, name: name, pass: pass}).length > 0) return database.searchInTable('passwords', {type: type, name: name, pass: pass})[0];
    else return null;
}

async function editPassword(type, name, newPass) {
    try {
        const existingCheck = await getPassword(type, name);
        if (existingCheck) {
            const newData = { pass: newPass };
            database.editElementInTable('password', existingCheck.id, newData);
            console.log(`Le mot de passe a été mis à jour avec succès.`);
        } else {
            console.error(`Ces identifiants n'existent pas dans la base de donnée.`);
        }
    } catch (error) {
        console.error('Erreur lors de la modification du mot de passe :', error);
        throw error;
    }
}

module.exports = {
    addPassword,
    getPassword,
    editPassword
};