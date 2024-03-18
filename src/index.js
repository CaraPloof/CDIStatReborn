var express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const csvParser = require('csv-parser');
const crypto = require('crypto');
const config = require("../config.json");
const cdi_timetable = require("./timetable");

var app = express();
var port = config.port || 8080;

var webpass = config.webPassword;
var students = [];

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

fs.createReadStream('students.csv')
    .pipe(csvParser())
    .on('data', (row) => {
        students.push(row);
    })
    .on('end', () => {
        console.log(students.length + ' students were discovered.');
    });

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/register', function(req, res) {
    let password = req.query.password;
    if (password == hashString(webpass)) res.render('pages/register');
    else res.render('pages/index');
});

app.get('/search', function(req, res) {
    const lastName = req.query.lastName.toLowerCase();
    const results = students.filter(student => student.Nom.toLowerCase().startsWith(lastName));
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