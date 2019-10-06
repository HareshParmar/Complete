const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Home', message: 'Welcome to my first Node Application' });
});

module.exports = router;