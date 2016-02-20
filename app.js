var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var randomAnimal = require('./routes/route');

var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/iota';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/zoo_animals', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM zoo_animals ORDER BY id ASC');

        query.on('row', function(row) {
            results.push(row);
        });

        query.on('end', function() {
            done();
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});

app.post('/zoo_animals', function(req, res) {
    var addAnimal = {
        animal: req.body.animal,
        number: randomAnimal(1, 100)
    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO zoo_animals (animal, number) VALUES ($1, $2)",
            [addAnimal.animal, addAnimal.number],
            function(err, result) {
                done();

                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            }
        );
    });
});

app.get('/*', function(req, res) {
    var file = req.params[0] || 'views/index.html';
    res.sendFile(path.join(__dirname, './server/public/', file));
});


app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});