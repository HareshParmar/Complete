const Joi = require('joi');
const mongoose = require('mongoose');
const { genreSchema } = require('./genresModel');

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genreId: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255,
        required: true
    }
});

const Movie = mongoose.model('Movie', moviesSchema);

function validateMovie(movie) {
    const schema = {
        title: Joi.string().min(3).required(),
        genreId : Joi.objectId().required(), // here we only required the id of genre // hybrid approach
        dailyRentalRate: Joi.number().min(0).required(),
        numberInStock: Joi.number().min(0).required()
    };
    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
exports.moviesSchema = moviesSchema;