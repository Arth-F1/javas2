const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Arth@F1',
    database: 'tech_club'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('MySQL connected...');
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.post('/submit', (req, res) => {
    const { name, email, dob, about, achievements, grade, notifications } = req.body;


    console.log('Form data received:', req.body);


    const query = 'INSERT INTO members (name, email, dob, about, achievements, grade, notifications) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, email, dob, about, achievements, grade, notifications], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('An error occurred while submitting the form.');
        }
        console.log('Data inserted successfully:', result);
        res.send('Form submitted successfully!');
    });
});

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


const gracefulShutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        db.end(err => {
            if (err) {
                console.error('Error closing MySQL connection:', err);
            } else {
                console.log('MySQL connection closed.');
            }
            process.exit(0);
        });
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);


app.get('/shutdown', (req, res) => {
    res.send('Server is shutting down...');
    gracefulShutdown();
});