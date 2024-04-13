var express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const csvParser = require('csv-parser');
const crypto = require('crypto');
const config = require("../config.json");
const cdi_timetable = require("./timetable");

const print = ((object) => {console.log(object)});

var app = express();
var port = config.port || 8080;

var webpass = config.webPassword;
var adminpass = config.adminPassword;

const database = require("./database/database");
const checksTb = require("./database/tables/checks");
const classesTb = require("./database/tables/classes");
const studentsTb = require("./database/tables/students");
const passwordsTb = require("./database/tables/passwords");
const timeSlotsTb = require("./database/tables/timeSlots");
const configsTb = require("./database/tables/configs");

var students = [];
var classes = [];

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.set('view engine', 'ejs');
/*(async () => {
    const check = await checksTb.getCheck('students.csv');
    if (await checksTb.getCheck('students.csv') == null || await check.sha256 !== hashFile('students.csv')) {
        fs.createReadStream('students.csv')
            .pipe(csvParser())
            .on('data', (row) => {
                students.push(row);
                if (!classes.includes(row.Classe)) classes.push(row.Classe);
            })
            .on('end', async () => {
                console.log(classes.length + ' classes were discovered.');
                for (_class of classes) await classesTb.createClass(_class);
                if (!await checksTb.getCheck('students.csv')) checksTb.addCheck('students.csv', hashFile('students.csv'));
                else await checksTb.editCheck("students.csv", hashFile('students.csv'));
                for (student of students) await studentsTb.addStudent(student.Prenom, student.Nom, student.Classe);
                console.log(students.length + ' students were discovered.');
            });
    }
})();*/

app.get('/', async function(req, res) {
    const configured = await configsTb.getConfig("configured");
    if (!configured != 1) res.redirect('/install');
    else res.render('pages/index');
});

app.get('/register', async function(req, res) {
    let password = req.query.password;
    passCheck = await passwordsTb.getPassword(1, 'web', password);
    if (passCheck != null) res.render('pages/register');
    else res.redirect('/');
});

app.get('/search', async function(req, res) {
    const prefix = req.query.lastName.toLowerCase();
    const search = await studentsTb.getStudentsByLastNamePrefix(prefix);
    const results = [];
    for (i = 0; i < search.length; i++) {
        const _class = await classesTb.getClassById(search[i].class);
        results.push({
            Nom: search[i].lastName,
            Prenom: search[i].firstName,
            Classe: _class.name
        });
    }
    res.json(results);
});

app.get('/timeSlots', function(req, res) {
    res.json(cdi_timetable.getCurrentTimeRange());
});

var installationStarted = false;
var installationToken;
var installationStep = 1;

app.get('/install', function(req, res) {
    if (installationStep > 7) { 
        res.redirect('/');
        return;
    }

    res.render('pages/install/' + installationStep);
});

app.get('/config', async function(req, res) {
    // if (!installationStarted) return;
    // const token = req.query.token;
    // if (token != installationToken) return;
    switch (installationStep) { // Etapes de la configuration du logiciel
        case 1:  // Accepter la license MIT
            const acceptLicense = req.query.acceptLicense;
            if (acceptLicense == "true") {
                await configsTb.addConfig("LICENSE", acceptLicense);
                installationStep++;
            }
            res.redirect('/install');
            break;
        case 2: // Configurer le mot de passe pour unlock les inscriptions des élèves
            const webP = req.query.web;
            if (webP) {
                await passwordsTb.addPassword(1, 'web', hashString(webP));
                installationStep++;
            }
            res.redirect('/install');
            break;
        case 3: // Configurer le mot de passe pour accéder à l'espace administrateur
            const adminP = req.query.admin;
            if (adminP) {
                await passwordsTb.addPassword(1, 'admin', hashString(adminP));
                installationStep++;
            }
            res.redirect('/install');
            break;
        case 4: // Configurer les horraires du CDI
            const stateTimeSlots = req.query.state; // 0: Ajout, 1: Retrait, 2: Conclusion
            // Time slot: day/min:sec-min:sec
            switch (stateTimeSlots) {
                case '0':
                    const timeSlotsA = req.query.timeSlots;
                    const dayA = timeSlotsA.split('/')[0];
                    const fromA = timeSlotsA.split('/')[1].split('-')[0];
                    const toA = timeSlotsA.split('/')[1].split('-')[1];
                    await timeSlotsTb.addTimeSlots(parseInt(dayA), fromA, toA);
                    res.send("OK");
                    break;
                case '1':
                    const timeSlotsR = req.query.timeSlots;
                    const dayR = timeSlotsR.split('/')[0];
                    const fromR = timeSlotsR.split('/')[1].split('-')[0];
                    const toR = timeSlotsR.split('/')[1].split('-')[1];
                    await timeSlotsTb.deleteTimeSlots(parseInt(dayR), fromR, toR);
                    res.send("OK");
                    break;
                case '2':
                    installationStep++;
                    res.redirect('/install');
                    break;
                default:
                    break;
            }
            break;
        case 5:
            const capacity = req.query.capacity;
            await configsTb.addConfig("capacity", parseInt(capacity));
            const overbooking = req.query.overbooking;
            await configsTb.addConfig("overbooking", overbooking);
            if (overbooking == 'true') {
                const overroom = req.query.overroom;
                await configsTb.addConfig("overroom", parseInt(overroom));
            }
            const longreg = req.query.longreg;
            await configsTb.addConfig("longreg", longreg);
            const unreg = req.query.unreg;
            await configsTb.addConfig("unreg", unreg);
            installationStep++;
            res.redirect('/install');
            break;
        case 6: // Configurer les activités du CDI
            const stateActivities = req.query.state; // 0: Ajout, 1: Retrait, 2: Conclusion
            switch (stateActivities) {
                case '0':
                    const toRemove = req.query.element;
                    break;
                case '1':
                    const toAdd = req.query.element;
                    break;
                case '2':
                    break;
                default:
                    break;
            }
            break;
        case 7: // Configurer la sauvegarde automatique
            const enableBackup = req.query.enable;
            if (enableBackup == '1') {
                const folder = req.query.folder;
                
            }
            break;
        default:
            break;
    }
});

app.listen(port);
console.log(`Server is listening on port ${port}.`);

function hashString(inputString) {
    const hash = crypto.createHash('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}

function hashFile(file) {
    const buff = fs.readFileSync(file);
    return hashString(buff);
}