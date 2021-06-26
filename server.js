const express = require("express");
const fs = require("fs");
const path = require('path');
const util = require('util');
const { v4: uuidv4 } = require('uuid');

//Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

//express middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


//set variables 
const writeFileSync = util.promisify(fs.writeFile);
const readFileSync = util.promisify(fs.readFile);
let allNotes;


//router

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("/api/notes", (req, res) => {
    readFileSync("./db/db.json", "utf8")
        .then((data) => {
            return res.json(JSON.parse(data));
        });
});

app.post("/api/notes", (req, res) => {
    const {title, text} = req.body;
    const newNote = {title, text, id:uuidv4()}
    readFileSync("./db/db.json", "utf8")
        .then((data) => {
            allNotes = JSON.parse(data);
            // console.log(allNotes);
            allNotes.push(newNote);
            writeFileSync("./db/db.json", JSON.stringify(allNotes))
                .then((note) => {
                    console.log("write db.json file");
                    return res.json(note)
                })
        });
});
//delete requests 
app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id;
    readFileSync("./db/db.json", "utf8")
        .then((data) => {
            allNotes = JSON.parse(data);
            allNotes.splice(id, 1);
            writeFileSync("./db/db.json", JSON.stringify(allNotes))
                .then(() => {
                    console.log("delete db.json file");
                })
        });
    res.json(id);
});


//LISTENER
app.listen(PORT, () => {
    console.log(`API server now on ${PORT}`)
});
