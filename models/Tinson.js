const mongoose = require('mongoose');

const TinsonSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    files: { type: [{ url: String, size: Number, _id: false }] },
    directories: { type: Array }
});

module.exports = mongoose.model('Tinson', TinsonSchema);