const database = require("../database");

timeSlotsColumns = ['day', 'from', 'to'];
database.createTable("timeSlots", timeSlotsColumns);

timeSlotsExample = {
    day: '0', // Monday
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
        if (database.searchInTable('timeSlots', { day, from, to }).length === 0) {
            database.addToTable("timeSlots", timeSlots);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la plage horaire :', error);
        throw error;
    }
}

async function getTimeSlots(day, from, to) {
    const students = database.searchInTable('timeSlots', { day, from, to });
    return students.length > 0 ? students[0] : null;
}

async function deleteTimeSlots(day, from, to) {
    const timeSlots = await getTimeSlots(day, from, to);
    if (!timeSlots) return;
    database.deleteElementInTable('timeSlots', timeSlots.id);
}

module.exports = {
    addTimeSlots,
    getTimeSlots,
    deleteTimeSlots
};