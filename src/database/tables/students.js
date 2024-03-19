const database = require("../database");
const classes = require("./classes");

const studentColumns = ['firstName', 'lastName', 'class'];
database.createTable('students', studentColumns);

const studentExample = {
    firstName: 'John',
    lastName: 'Doe',
    class: 0
};

async function addStudent(firstName, lastName, className) {
    const _class = await classes.getClass(className);
    const student = {
        firstName,
        lastName,
        class: _class.id 
    };
    try {
        if (database.searchInTable('students', { firstName, lastName }).length === 0) {
            database.addToTable("students", student);
            console.log(`L'étudiant ${firstName} ${lastName} a bien été ajouté.`);
        } else {
            console.error(`L'étudiant ${firstName} ${lastName} existe déjà.`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'étudiant :', error);
        throw error;
    }
}

async function getStudent(firstName, lastName) {
    const students = database.searchInTable('students', { firstName, lastName });
    return students.length > 0 ? students[0] : null;
}

async function getStudentsByLastNamePrefix(prefix) {
    return await database.searchByPrefix('students', 'lastName', prefix);
}

module.exports = {
    addStudent,
    getStudent,
    getStudentsByLastNamePrefix
};
