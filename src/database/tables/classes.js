const database = require("../database");

const classColumns = ['name'];
database.createTable('classes', classColumns);

const classExample = {
    name: 'TE4'
};

async function createClass(name) {
    const _class = {
        name
    };
    try {
        if (database.searchInTable('classes', {name: name}).length === 0) {
            database.addToTable("classes", _class);
            console.log(`La classe ${name} a bien été ajoutée.`);
        }
    } catch (error) {
        console.error('Erreur lors de la création de la classe :', error);
        throw error;
    }
}

async function getClass(name) {
    if (await database.searchInTable('classes', {name: name}).length > 0) return await database.searchInTable('classes', {name: name})[0];
    else return null;
}

async function getClassById(id) {
    if (await database.searchInTable('classes', {id: id}).length > 0) return await database.searchInTable('classes', {id: id})[0];
    else return null;
}

module.exports = {
    createClass,
    getClass,
    getClassById
};