const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const db = mongoose.connection;
const tinsonSchema = new mongoose.Schema({
    name: { type: String, index: { unique: true } },
    files: { type: Array },
    directories: { type: Array }
});
const Tinson = mongoose.model('tinsonFiles', tinsonSchema);
db.once('open', function () {
    // All OK - fire (emit) a ready event. 
    app.emit('ready');
});

const app = express();
const BASE_SALT = '16sette11'; // add a salt just for split user from password in React

app.use(express.json()) // for parsing application/json

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));



// Put all API endpoints under '/api'
app.post('/api/register', (req, res) => {

    const { name, password } = req.body;
    if (name && password) {
        const base64name = Buffer.from(name + BASE_SALT + password).toString('base64');
        const file = new Tinson({
            name: base64name
        })
        db.collection('tinsonFiles').insertOne(file, function (err, response) {
            if (err) {
                const message = (err.code === 11000
                    ? 'Account already exists. Please login.'
                    : 'Some error appear!');
                res.json({ success: false, message: message, data: err });
            } else {
                res.json({ success: true, message: "Account created succesfully" });
            }
        })
    }
});

app.post('/api/login', async (req, res) => {

    const { name, password } = req.body;
    const base64name = Buffer.from(name + BASE_SALT + password).toString('base64');

    const entries = await checkIfUserExists(base64name);
    if (entries.success) {
        res.json({ success: true, message: "Logged in. You're going to be redirected to dashboard", _id: base64name });
    } else {
        res.json({ success: false, message: 'No user found with this credentials. Please register now.' })
    }
})

app.post('/api/exists', async (req, res) => {
    const base64name = req.body._id;
    const exists = await checkIfUserExists(base64name);
    if (exists.success) {
        res.json({ success: true })
    }
})

app.post('/api/add-folder', async (req, res) => {
    const entries = await checkIfUserExists(req.headers.authorization);
    if (entries.success) {
        const directoriesList = entries.data.directories ? entries.data.directories : [];
        const dirname = req.body.dirname.replace(/\w+/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1);
        }).replace(/\s/g, '');
        const link = `${req.body.dirlink}#${req.body.dirname}`;
        directoriesList.push(link);
        const { success } = await updateEntry(req.headers.authorization, directoriesList, true);
        if (success) {
            res.json({ success: true, message: 'Games updated correctly!' })
        } else {
            res.json({ success: false, message: 'Something wrong happened!' })
        }
    } else {
        res.json({ success: false, message: 'User not found :(', error: entries.err })
    }
})

app.post('/api/add-game', async (req, res) => {
    const entries = await checkIfUserExists(req.headers.authorization);
    if (entries.success) {
        const gameList = entries.data.files;
        const gname = req.body.gname.replace(/\w+/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1);
        }).replace(/\s/g, '');
        const game = `https://docs.google.com/uc?export=download&id=${req.body.gid}#${gname}.nsp`;
        gameList.push(game);
        const { success } = await updateEntry(req.headers.authorization, gameList);
        if (success) {
            res.json({ success: true, message: 'Games updated correctly!' })
        } else {
            res.json({ success: false, message: 'Something wrong happened!' })
        }
    } else {
        res.json({ success: false, message: 'User not found :(', error: entries.err })
    }
})

app.get('/api/gamelist', async (req, res) => {
    const entries = await checkIfUserExists(req.headers.authorization);
    entries.success
        ? res.json({ success: true, message: 'List loaded succesfully', data: entries.data })
        : res.json({ success: false, message: 'User not found', error: entries.data });
})

app.post('/api/gamelist', async (req, res) => {
    const target = req.body.index;
    const deleteFolder = req.body.deletefolder;

    const toDelete = deleteFolder ? 'directories' : 'files';

    const base64name = req.headers.authorization;
    const entries = await checkIfUserExists(base64name);

    if (entries.success) {
        let contentToDelete = entries.data[toDelete];
        contentToDelete = contentToDelete.filter((v, i) => !target.includes(i));
        console.log(contentToDelete);
        const { success } = await updateEntry(base64name, contentToDelete, deleteFolder);
        if (success) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Something wrong happened' })
        }
    } else {
        res.json({ success: false, message: 'user not found', error: err });
    }
})

// Route for Tinfoil. Return user JSON if it exists.
app.get('/v1/:user/:pass', async (req, res) => {
    const { user, pass } = req.params;
    const base64name = Buffer.from(user + BASE_SALT + pass).toString('base64');
    const response = await checkIfUserExists(base64name);
    if (response.success) {
        const forTinfoil = {
            files: response.data.files,
            directories: response.data.directories,
            success: "Thanks for using Tinson! For every issue please report it in issues tab in Github (github.com/gianemi2/tinson-node)"
        }
        res.json(forTinfoil);
    } else {
        res.json({ success: false, message: 'Something wrong happened' })
    }
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.on('ready', () => {
    app.listen(port, () => {
        console.log(`Tinson is listening on ${port}`);
    })
})


const checkIfUserExists = (base64name) => {
    if (!base64name) {
        return { success: false };
    }
    return new Promise((resolve, reject) => {
        db.collection('tinsonFiles').findOne({ name: base64name })
            .then(function (res) {
                if (res == null) throw new Error('No user found with this name');
                resolve({ success: true, data: res })
            })
            .catch(function (err) {
                resolve({ success: false, data: err })
            })
    })
}

const updateEntry = function (base64name, files, isFolder = false) {
    const update = isFolder
        ? { $set: { "directories": files } }
        : { $set: { "files": files } };

    return new Promise((resolve, reject) => {
        db.collection('tinsonFiles').updateOne({ "name": base64name }, update)
            .then(function (res) {
                resolve({ success: true, data: res })
            })
            .catch(function (err) {
                resolve({ success: false, data: err })
            })
    })
}