const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true
    }
});

const exerciseScehma = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: String
})

const User = mongoose.model('User', userSchema);
const Exercise = mongoose.model('Exercise', exerciseScehma);

module.exports = { User, Exercise }
