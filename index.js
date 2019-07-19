const express = require('express');
const path = require('path');
const fs = require('fs')
require('dotenv').config();

const app = express();
const { BASE_SALT } = process.env;

app.use(express.json()) // for parsing application/json

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.post('/api/register', (req, res) => {

    const { name, password } = req.body;
    if (name && password) {
        const base64name = Buffer.from(name + BASE_SALT + password).toString('base64');
        const baseJSON = JSON.stringify({ files: [] });
        fs.writeFile(`json/${base64name}.json`, baseJSON, (err, result) => {
            if (err) console.log('error', err);
        });
        res.json({ success: true, message: "Account created succesfully" });
    }
});

app.post('/api/login', (req, res) => {

    const { name, password } = req.body;
    const base64name = Buffer.from(name + BASE_SALT + password).toString('base64');

    fs.readFile(`json/${base64name}.json`, 'utf8', function (err, data) {
        if (err) {
            const message = (err.code == 'ENOENT' ? 'Credentials are wrong.' : 'Some error appear');
            res.json({ success: false, message: message, error: err });
        } else {
            res.json({ success: true, message: "Logged in. You're going to be redirected to dashboard!", _id: base64name });
        }
    });
})

app.post('/api/exists', async (req, res) => {
    fs.exists(`json/${req.body._id}.json`, (exists) => {
        res.json({ success: exists })
    })
})

app.post('/api/add-game', (req, res) => {
    const filePath = `json/${req.headers.authorization}.json`;
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            res.json({ success: false, message: 'user not found :(', error: err });
            return;
        }
        const gameList = JSON.parse(data);
        const game = `https://docs.google.com/uc?export=download&id=${req.body.gid}#${req.body.gname}.nsp`;
        gameList.files.push(game);
        const gameListJSON = JSON.stringify(gameList);
        fs.writeFile(filePath, gameListJSON, (err, result) => {
            if (err) {
                res.json({ success: false, message: 'some error happened', error: err })
            } else {
                res.json({ success: true, message: 'Game added succesfully!' });
            }
        });
    });
})

app.get('/api/gamelist', (req, res) => {
    fs.readFile(`json/${req.headers.authorization}.json`, 'utf8', function (err, data) {
        if (err) {
            res.json({ success: false, message: 'user not found', error: err });
        } else {
            res.json({ success: true, message: 'List loaded succesfully', data: data })
        }
    })
})

app.post('/api/gamelist', (req, res) => {
    const target = req.body.index;
    const filePath = `json/${req.headers.authorization}.json`;
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            res.json({ success: false, message: 'user not found', error: err });
        } else {
            let gamelist = JSON.parse(data);
            gamelist.files.splice(target, 1);
            gamelist = JSON.stringify(gamelist);
            fs.writeFile(filePath, gamelist, (err) => {
                if (err) {
                    res.json({ success: false, message: 'some error happened', error: err })
                } else {
                    res.json({ success: true, message: 'Game deleted succesfully!' });
                }
            })
        }
    })
})

app.get('/v1/:user/:pass', (req, res) => {
    const { user, pass } = req.params;
    const filePath = `json/${Buffer.from(user + BASE_SALT + pass).toString('base64')}.json`;
    fs.readFile(filePath, 'utf8', (err, json) => {
        if (err) {
            res.json({ error: err })
        } else {
            const result = JSON.parse(json);
            res.json(result);
        }
    })
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Tinson is listening on ${port}`);