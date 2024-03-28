const database = require("../database");

timeSlotsColumns = ['day', 'from', 'to'];
database.createTable("timeSlots", timeSlotsColumns);

timeSlotsExample = {
    day: '1', // Monday
    from: '08:10',
    to: '09:05'
};

async function addTimeSlots(day, from, to) {
    const timeSlots = {
        day,
        from,
        to
    };
    try {
        if (database.searchInTable('students', { day, from, to }).length === 0) {
            database.addToTable("timeSlots", timeSlots);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la plage horaire :', error);
        throw error;
    }
}

module.exports = {
    addTimeSlots
};