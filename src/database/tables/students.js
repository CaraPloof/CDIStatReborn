const database = require("../database");

const studentColumns = ['firstName', 'lastName', 'className'];
database.createTable('students', studentColumns);

const studentExample = {
    firstName: 'John',
    lastName: 'Doe',
    className: 'TE4'
};

async function addStudent(firstName, lastName, className) {
    const student = {
        firstName,
        lastName,
        className
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

module.exports = {
    addStudent,
    getStudent
};
