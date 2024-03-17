const timetable = require('../cdi_timetable.json');

// Fonction pour vérifier si une heure est dans une plage horaire donnée
function isInTimeRange(time, start, end) {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const [hour, min] = time.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    const currentTime = hour * 60 + min;

    return currentTime >= startTime && currentTime <= endTime;
}

// Fonction pour obtenir le jour de la semaine actuel
function getCurrentDay() {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const today = new Date().getDay();
    return days[today];
}

// Fonction pour déterminer la plage horaire actuelle
function getCurrentTimeRange() {
    const currentDay = getCurrentDay();
    const currentTime = new Date().toLocaleTimeString('fr-FR', {hour12: false});
    const timeRanges = timetable.cdi_horaires[currentDay].plages_horaires;

    for (const range of timeRanges) {
        if (isInTimeRange(currentTime, range.ouverture, range.fermeture)) {
            return range;
        }
    }

    return null; // Pas de plage horaire correspondante
}

// Exécution
/*const currentTimeRange = getCurrentTimeRange();
if (currentTimeRange) {
    console.log(`Vous êtes dans la plage horaire : ${currentTimeRange.ouverture} - ${currentTimeRange.fermeture}`);
} else {
    console.log("Vous n'êtes dans aucune plage horaire pour aujourd'hui.");
}*/

module.exports = {
    getCurrentTimeRange
};