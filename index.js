// Get something useful
const express = require('express');
const path = require('path');
const axios = require('axios');

// Retrieve all .env configurations
require('dotenv').config();

// Setup all DB configurations and models
const mongoose = require('mongoose');
const User = require('./models/User');
const Tinson = require('./models/Tinson');

// Import something for auth flow
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const withAuth = require('./middleware');
const Hashkit = require("hashkit");
const secret = process.env.SECRET;

const hashkit = new Hashkit();

// Db setup
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', function () {
    // All OK - fire (emit) a ready event. 
    app.emit('ready');
});

// App setup
const app = express();
app.use(cookieParser()); // for parsing cookies
app.use(express.json()) // for parsing application/json

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put all API endpoints under '/api'
app.post('/api/register', (req, res) => {

    const { name, password } = req.body;
    const user = new User({ name, password });

    user.save(function (err) {
        if (err) {
            if (err.code == 11000) {
                res.json({ success: false, data: 'User already registered. Please log in.' })
            } else {
                res.json({ success: false, data: "Error registering new user please try again." });
            }
        } else {
            const tinson = new Tinson({ name: user._id });
            tinson.save(function (err) {
                if (err) {
                    res.json({ success: false, data: "Some error occured", error: err })
                } else {
                    res.json({ success: true, data: "User registered succesfully." });
                }
            })
        }
    });
});

// Authentication on login
app.post('/api/authenticate', function (req, res) {
    const { name, password } = req.body;
    User.findOne({ name }, function (err, user) {
        if (err) {
            res.status(500)
                .json({
                    success: false,
                    data: 'Internal error please try again'
                });
        } else if (!user) {
            res.status(401)
                .json({
                    success: false,
                    data: 'Incorrect email or password'
                });
        } else {
            user.isCorrectPassword(password, function (err, same) {
                if (err) {
                    res.status(500)
                        .json({
                            success: false,
                            data: 'Internal error please try again'
                        });
                } else if (!same) {
                    res.status(401)
                        .json({
                            success: false,
                            data: 'Incorrect email or password'
                        });
                } else {
                    // Issue token
                    const payload = { id: user.id };
                    const token = jwt.sign(payload, secret, {
                        expiresIn: '1h'
                    });
                    res.cookie('token', token, { httpOnly: true })
                        .sendStatus(200);
                }
            });
        }
    });
});

app.get('/deleteSession', (req, res) => {
    res.clearCookie("token");
    res.json({ success: true, data: 'Logged out succesfully!' })
})

// Check if user is logged in
app.get('/checkToken', withAuth, (req, res) => {
    res.status(200).json({ success: true, data: req.id });
});

app.get('/api/welcome-message', withAuth, async (req, res) => {
    const entries = await checkIfUserExists(req.id);

    entries.success
        ? res.json({ success: true, message: 'Message loaded succesfully', data: entries.data })
        : res.json({ success: false, message: "There's been an error", error: entries.data });
})

app.post('/api/welcome-message', withAuth, async (req, res) => {
    const entries = await checkIfUserExists(req.id);
    if (entries.success) {
        // Get the string from POST request with success message in it
        const newMessage = req.body.message;
        const { success } = await updateEntry(req.id, newMessage, 'success');
        if (success) {
            res.json({ success: true, message: 'Success message update correctly!' });
        } else {
            res.json({ success: false, message: 'Something wrong happened!' })
        }
    }
})

// Route for add folders.
app.post('/api/add-folder', withAuth, async (req, res) => {
    const entries = await checkIfUserExists(req.id);

    if (entries.success) {
        const tinfoilLegacyMode = req.body.legacy ? true : false;
        // Retrieve list or initiate empty array
        const directoriesList = entries.data.directories ? entries.data.directories : [];
        // Flush strange chars on name
        const dirname = req.body.dirname.replace(/\w+/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1);
        }).replace(/\s/g, '');
        // Mount link with name
        const dirlink = tinfoilLegacyMode
            ? 'https://drive.google.com/drive/folders/'
            : 'gdrive:/'
        const link = `${dirlink}${req.body.dirlink}#${dirname}`;
        // Push it to array
        directoriesList.push(link);

        // Try to update
        const { success } = await updateEntry(req.id, directoriesList, 'directories');
        if (success) {
            res.json({ success: true, message: 'Games updated correctly!' })
        } else {
            res.json({ success: false, message: 'Something wrong happened!' })
        }
    } else {
        res.json({ success: false, message: 'User not found :(', error: entries.err })
    }
})

// Route for add files
app.post('/api/add-game', withAuth, async (req, res) => {
    const entries = await checkIfUserExists(req.id);

    if (entries.success) {
        const tinfoilLegacyMode = req.body.legacy ? true : false;
        // Retrieve list or initiate empty array
        const gameList = entries.data.files ? entries.data.files : [];
        // Flush strange chars on name
        const gname = req.body.gname.replace(/\w+/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1);
        }).replace(/\s/g, '');

        // Retrieve file size using gDrive API
        let size = await getDriveFileSize(req.body.gid);
        let ext = await getDriveFileExtension(req.body.gid) || 'nsp';
        let base_api = tinfoilLegacyMode
            ? 'https://docs.google.com/uc?export=download&id='
            : 'gdrive:'

        const game = {
            // Mount link with name
            url: `${base_api}${req.body.gid}#${gname}.${ext}`,
            size: size
        }
        // Push it to array
        gameList.push(game);

        // Try to update
        const { success } = await updateEntry(req.id, gameList);

        if (success) {
            res.json({ success: true, message: 'Games updated correctly!' })
        } else {
            res.json({ success: false, message: 'Something wrong happened!' })
        }
    } else {
        res.json({ success: false, message: 'User not found :(', error: entries.err })
    }
})

// Router for list all games for current user
app.get('/api/gamelist', withAuth, async (req, res) => {
    let entries = await checkIfUserExists(req.id);
    if (entries.data.files.length > 0 && entries.data.files.every((i) => typeof i === "string")) {
        entries = await solveCompatibilityIssues(entries);
    }

    entries.success
        ? res.json({ success: true, message: 'List loaded succesfully', data: entries.data })
        : res.json({ success: false, message: 'User not found', error: entries.data });
})

// Route for delete games or folders
app.post('/api/gamelist', withAuth, async (req, res) => {
    // Get index to remove
    const target = req.body.index;
    // Check if want to delete folder or files
    const deleteFolder = req.body.deletefolder;
    const toDelete = deleteFolder ? 'directories' : 'files';
    // Retrieve current user table
    const entries = await checkIfUserExists(req.id);

    if (entries.success) {
        // Delete from array
        let contentToDelete = entries.data[toDelete];
        contentToDelete = contentToDelete.filter((v, i) => !target.includes(i));

        // Try to update
        const { success } = await updateEntry(req.id, contentToDelete, toDelete);
        if (success) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Something wrong happened' })
        }
    } else {
        res.json({ success: false, message: 'User not found', error: err });
    }
})

// Route for Tinfoil. Return user JSON if it exists.
app.get('/v1/:userid', async (req, res) => {
    const response = await checkIfUserExists(req.params.userid);
    if (response.success) {
        const forTinfoil = {
            files: response.data.files,
            directories: response.data.directories,
            success: `${response.data.success} REMEMBER THAT TINSON AND TINFOIL IS FREE AND ALWAYS WILL BE. PLEASE SEND A MAIL TO GIANEMI2@GMAIL.COM IF SOMEONE HAS SOLD THIS TO YOU.`,
            googleApiKey: process.env.GOOGLE_API_PUBLIC
        }
        res.json(forTinfoil);
    } else {
        res.json({ success: "Hi! This message means that Tinson is setup correctly but the no users has been found with the current ID." })
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

const checkIfUserExists = (userID) => {
    if (!userID) {
        return { success: false, data: 'Some errors appear...' };
    }
    return new Promise((resolve, reject) => {
        Tinson.findOne({ name: userID })
            .then(function (res) {
                if (res == null) throw new Error('No user found with this name');
                resolve({ success: true, data: res })
            })
            .catch(function (err) {
                resolve({ success: false, data: err })
            })
    })
}

const updateEntry = function (base64name, files, target = 'files') {
    const update = { $set: { [target]: files } };

    return new Promise((resolve, reject) => {
        Tinson.updateOne({ "name": base64name }, update)
            .then(function (res) {
                resolve({ success: true, data: res })
            })
            .catch(function (err) {
                resolve({ success: false, data: err })
            })
    })
}

const solveCompatibilityIssues = async function (entries) {
    const model = entries.data;
    const newFilesObj = [];
    for (let i = 0; i < model.files.length; i++) {
        const id = new URL(model.files[i]).searchParams.get('id');
        const newFile = {
            url: model.files[i],
            size: await getDriveFileSize(id)
        }
        newFilesObj.push(newFile);
    }
    return new Promise((resolve, reject) => {
        Tinson.updateOne({ "name": model.name }, {
            $set: { files: newFilesObj }
        })
    })
        .then((res) => {
            resolve({ success: true, data: res })
        })
        .catch((err) => {
            resolve({ success: false, data: err })
        })
}

const getDriveFileExtension = async function (driveId) {
    return axios.get(`https://content.googleapis.com/drive/v2/files/${driveId}?key=${process.env.GOOGLE_API}`)
        .then(response => {
            if (response) {
                return response.data.fileExtension
            }
        })
        .catch(error => {
            return 0;
        })
}

const getDriveFileSize = async function (driveId) {
    return axios.get(`https://content.googleapis.com/drive/v2/files/${driveId}?key=${process.env.GOOGLE_API}`)
        .then(response => {
            if (response) {
                return response.data.fileSize
                    ? parseInt(response.data.fileSize)
                    : 0;
            }
        })
        .catch(error => {
            return 0;
        })

}