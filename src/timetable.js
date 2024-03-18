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

// Calcule le nombre d'heures disponibles pour inscription
function availableHours(currentTimeRange) {
    if (!currentTimeRange) return null;

    const [currentHour, currentMin] = new Date().toLocaleTimeString('fr-FR', {hour12: false}).split(':').map(Number);
    const [endHour, endMin] = currentTimeRange.fermeture.split(':').map(Number);

    const currentTime = currentHour * 60 + currentMin;
    const endTime = endHour * 60 + endMin;

    const remainingMinutes = endTime - currentTime;
    const remainingHours = Math.floor(remainingMinutes / 60);
    const remainingMins = remainingMinutes % 60;

    if (remainingMins >  15) return remainingHours + 1;

    return remainingHours;
}

// Exécution
/*
const currentTimeRange = getCurrentTimeRange();
if (currentTimeRange) {
    const availableTime = availableHours(currentTimeRange);
    if (availableTime) {
        console.log(`Vous pouvez vous inscrire pour ${availableTime}h dans la plage horaire : ${currentTimeRange.ouverture} - ${currentTimeRange.fermeture}`);
    } else {
        console.log("Vous êtes dans la plage horaire, mais il est impossible de calculer le temps restant.");
    }
} else {
    console.log("Vous n'êtes dans aucune plage horaire pour aujourd'hui.");
}
*/

module.exports = {
    getCurrentTimeRange,
    availableHours
};