const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
    name: { type: String, required: true },
    img: String,
    isSelected: { type: Boolean, default: false }
});

const UserSchema = new Schema({
    name: { type: String, default: "Unknown person" },
    image: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, unique: true },
    phone: String,
    songs: [SongSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema, 'users');
