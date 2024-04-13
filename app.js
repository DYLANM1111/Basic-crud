const express = require('express');
const fs = require('fs');
const app = express();
const port = 4000;

const DATA_FILE = "data.txt";

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/create', (req, res) => {
    const { name, age } = req.body;
    fs.appendFile(DATA_FILE, `${name},${age}\n`, (err) => {
        if (err) throw err;
        console.log('Data saved successfully');
        res.redirect('/');
    });
});

app.get('/read', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) throw err;
        res.send(`<pre>${data}</pre>`);
    });
});

app.post('/update', (req, res) => {
    const { nameToUpdate, updatedAge } = req.body;
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) throw err;
        const lines = data.split('\n');
        const updatedData = lines.map(line => {
            const [name, age] = line.split(',');
            if (name === nameToUpdate) {
                return `${name},${updatedAge}`;
            }
            return line;
        }).join('\n');
        fs.writeFile(DATA_FILE, updatedData, 'utf8', (err) => {
            if (err) throw err;
            console.log('Data updated successfully');
            res.redirect('/');
        });
    });
});

app.post('/delete', (req, res) => {
    const { nameToDelete } = req.body;
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) throw err;
        const lines = data.split('\n');
        const filteredData = lines.filter(line => {
            const [name, _] = line.split(',');
            return name !== nameToDelete;
        }).join('\n');
        fs.writeFile(DATA_FILE, filteredData, 'utf8', (err) => {
            if (err) throw err;
            console.log('Data deleted successfully');
            res.redirect('/');
        });
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
