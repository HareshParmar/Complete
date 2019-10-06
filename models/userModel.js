const Joi = require('joi');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 30
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // email expression
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function () {
    // when using arrow function it does not have its own this so we use
    // traditional function
    const payload = {
        _id: this._id,
        name: this.name,
        isAdmin: this.isAdmin
    };
    // expiresIn takes value in seconds
    const token = jwt.sign(payload, config.get('jwtPrivateKey'), { expiresIn: 120 });
    return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(30).required(),
        email: Joi.string().min(8).max(50).required().email(),
        password: Joi.string().min(6).max(30).required(),
        isAdmin: Joi.boolean(),
    };
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;