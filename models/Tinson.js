const mongoose = require('mongoose');

const TinsonSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    files: {
        type: [
            {
                url: String,
                size: Number,
                _id: false
            }
        ]
    },
    directories: { type: Array },
    success: { type: String, default: "Thanks for using Tinson! For every issue please report it in issues tab in Github (github.com/gianemi2/tinson-node)" }
});

module.exports = mongoose.model('Tinson', TinsonSchema);