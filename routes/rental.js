const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const FAWN = require('fawn');
const { Rental, validate } = require('../models/rentalModel');
const { Customer } = require('../models/customerModel');
const { Movie } = require('../models/moviesModel');

// NOTE:- fawn is a library used to impose the transaction in mongodb
FAWN.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find(); // .sort('name'); //.sort({name : 1})
    res.status(200).send(rentals);
});

// router.post('/', async (req, res) => {
//     const { error } = validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const movie = Movie.findById(req.body.movieId);
//     if (!movie) return res.status(404).send('Movie not found');

//     const customer = Customer.findById(req.body.customerId);
//     if (!customer) return res.status(404).send('Customer not found');

//     const RentalData = new Rental({
//         retnalFee: req.body.retnalFee,
//         dateReturned: req.body.dateReturned,
//         customer: {
//             _id: customer.id,
//             name: customer.name,
//             phone: customer.phone
//         },
//         movie: {
//             _id: movie._id,
//             title: movie.title,
//             dailyRentalRate: movie.dailyRentalRate
//         }
//     });
//     const datas = await RentalData.save();
//     movie.numberInStock--;
//     movie.save();
//     res.status(201).send(datas);
// });

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    // rental = await rental.save();

    // movie.numberInStock--;
    // movie.save();

    // here we will create task, pass the database table name as is, its casesensitive
    try {
        new FAWN.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

        res.send(rental);
    } catch (err) {
        res.status(500);
    }
});


router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        // price: req.body.price,
        // rental: req.body.rental,
        // isReleased: req.body.isReleased,
    }, { new: true });

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental);
});

router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);
    if (!rental) return res.status(404).send('The rental with the given ID was not found.');
    res.send(rental);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('The rental with the given ID was not found.');
    res.send(rental);
});

module.exports = router;