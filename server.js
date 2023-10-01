const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//middleware for parson JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//API routes
//GET all notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.json(__dirname, '/db/db.json'), 'utf8', (error, data) => {
       if (error) {
        return res.status(500).json(error);
       } 
       res.json(JSON.parse(data));
    });
});

//POST a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile(path.json(__dirname, '/db/db.json'), 'utf8', (error, data) => {
        if (error) {
            return res.status(500).json(error);
        }
        const notes = JSON.parse(data);
        newNote.id = Date.now(); //using timestamp as unique id
        notes.push(newNote);
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 4), (err) => {
            if (err) return res.status(500).json(err);
            res.json(newNote);
        });
    });
});

//DELETE a note by id
app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (error, data) => {
        if (error) {
            return res.status(500).json(error);
        }
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 4), (err) => {
            if (err) return res.status(500).json(err);
            res.join({ msg: `Deleted note with id: ${noteId}` });
        });
    });
});

