const database = require("../database");

const classColumns = ['file', 'sha256'];
database.createTable('checks', classColumns);

const checkExample = {
    file: 'test.json',
    sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
};

async function addCheck(file, sha256) {
    const check = {
        file,
        sha256
    };
    try {
        if (database.searchInTable('checks', {file: file}).length === 0) {
            database.addToTable("checks", check);
            console.log(`Le check du fichier ${file} a bien été ajoutée.`);
        }
    } catch (error) {
        console.error('Erreur lors de la création de la vérification de fichier :', error);
        throw error;
    }
}

async function getCheck(file) {
    if (database.searchInTable('checks', {file: file}).length > 0) return database.searchInTable('checks', {file: file})[0];
    else return null;
}

async function editCheck(file, newSha256) {
    try {
        const existingCheck = await getCheck(file);
        if (existingCheck) {
            const newData = { sha256: newSha256 };
            database.editElementByAttribute("checks", "file", file, newData);
            console.log(`Le check du fichier ${file} a été mis à jour avec succès.`);
        } else {
            console.error(`Le fichier ${file} n'existe pas dans la base de données des checks.`);
        }
    } catch (error) {
        console.error('Erreur lors de la modification de la vérification de fichier :', error);
        throw error;
    }
}

module.exports = {
    addCheck,
    getCheck,
    editCheck
};