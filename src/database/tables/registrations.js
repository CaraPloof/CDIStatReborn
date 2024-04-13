const database = require("../database");
const students = require("./students");

const regColumns = ['day', 'date', 'time', 'student', 'duration', 'timeSlots'];
database.createTable('registrations', regColumns);

const regExample = {
    day: 1, // Monday
    date: '18/03/2024',
    time: "09:12",
    student: 0,
    duration: 1, // 1 hour
    timeSlots: "09h05-10h00"
};

async function addRegistration(day, date, time, studentLastName, studentFirstName, duration, timeSlots) {
    const student = await students.getStudent(studentFirstName, studentLastName);
    const registration = {
        day,
        date,
        time,
        student: student.id,
        duration,
        timeSlots
    };
    try {
        database.addToTable("registrations", registration);
        console.log(`L'inscription pour l'étudiant ${student} a bien été ajoutée.`);
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'inscription :", error);
        throw error;
    }
}

async function getRegistration(student) {
    return database.searchInTable('registrations', { student });
}

module.exports = {
    addRegistration,
    getRegistration
};