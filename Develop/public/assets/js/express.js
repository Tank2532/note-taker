const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.status(200).json(`${req.method} request received to get notes`);
    
    console.log(`${req.method} request received to get notes`);
});

app.post('/api/notes', (req, res) => {
    console.log(`${req.method} request received to add notes`);
    
    
    const { title, text } = req.body;
    
    if (title && text) {
        const newNotes = {
            title,
            text,
        };
        
        fs.readFile('../db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);
                
                parsedNotes.push(newNotes);
                
                fs.writeFile(
                    '../db/db.json',
                    JSON.stringify(parsedNotes, null, 3),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.log('Successfully updated notes!')
                    );
                }
            });
            
            const response = {
                status: 'success',
                body: newNotes,
            };
            
            console.log(response);
            res.status(201).json(response);
        } else {
            res.status(500).json('Error in posting notes');
        }
    });

app.delete('/api/notes/:id', (req, res) => {
        console.log(`${req.method} request received to delete notes`);
    });
    
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
    );