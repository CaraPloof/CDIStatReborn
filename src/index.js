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

const checksTb = require("./database/tables/checks");
const classesTb = require("./database/tables/classes");
const studentsTb = require("./database/tables/students");

var students = [];
var classes = [];


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
(async () => {
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
                for (_class of classes) {
                    await classesTb.createClass(_class);
                }
                if (!await checksTb.getCheck('students.csv')) checksTb.addCheck('students.csv', hashFile('students.csv'));
                else await checksTb.editCheck("students.csv", hashFile('students.csv'));
                for (student of students) {
                    await studentsTb.addStudent(student.Prenom, student.Nom, student.Classe);
                }
                console.log(students.length + ' students were discovered.');
            });
    }
})();

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/register', function(req, res) {
    let password = req.query.password;
    if (password == hashString(webpass)) res.render('pages/register');
    else res.render('pages/index');
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