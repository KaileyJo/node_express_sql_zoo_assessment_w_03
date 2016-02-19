var express = require('express');
var randomAnimal = express.Router();

randomAnimal.get('/', function(req, res) {
    function randomNumber(min, max){ return Math.floor(Math.random() * (1 + max - min) + min); }
    res.send(randomNumber(1, 100));
});

module.exports = randomAnimal;