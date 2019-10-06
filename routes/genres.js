const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Genre, validate } = require('../models/genresModel');
const admin = require('../middleware/admin');
const middlewareFunction = require('../middleware/async');


router.get('/', async (req, res) => {
    throw new Error('could not log genres');
    const genres = await Genre.find(); // .sort('name'); //.sort({name : 1})
    res.status(200).send(genres);
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const Data = new Genre({
        name: req.body.name,
        // price: req.body.price,
        // genre: req.body.genre,
        // isReleased: req.body.isReleased
    });
    const datas = await Data.save();
    res.status(201).send(datas);
});

router.put('/:id', async (req, res) => {
    // const genre = await Genre.findById(req.params.id);
    // if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    // genre.name = req.body.name;
    // genre.price = req.body.price;
    // genre.genre = req.body.genre;
    // genre.isReleased = req.body.isReleased;
    // const data = await genre.save();
    // res.send(data);

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        // price: req.body.price,
        // genre: req.body.genre,
        // isReleased: req.body.isReleased,
    }, { new: true });

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
});

module.exports = router;