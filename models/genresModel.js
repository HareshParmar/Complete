const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// const Genre = mongoose.model('Genre', genreSchema);

// or we can do something like

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    // genre: {
    //     type: String,
    //     required: true
    // },
    // date: {
    //     type: Date,
    //     default: Date.now
    // },
    // price: {
    //     type: Number,
    //     min: 0,
    //     get: v => Math.round(v),
    //     set: v => Math.round(v)
    // },
    // isReleased: {
    //     type: Boolean,
    //     default: false
    // }
}));

function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required()
        // price: Joi.number().min(0).required(),
        // genre: Joi.string().min(3).required(),
        // isReleased: Joi.boolean()
    };
    return Joi.validate(genre, schema);
}

exports.Genre = Genre; // here exports.Genre the Genre is name we can give any name here
exports.validate = validateGenre;
exports.genreSchema = genreSchema;