const Joi = require('joi');
const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        minlength: 6,
        maxlength: 10,
        get: v => Math.round(v),
        set: v => Math.round(v)
    },
    isGold: {
        type: Boolean,
        default: false
    }
});

const Customer = mongoose.model('Customer', CustomerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(3).required(),
        phone: Joi.number().required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
exports.validate = validateCustomer;
exports.CustomerSchema = CustomerSchema;