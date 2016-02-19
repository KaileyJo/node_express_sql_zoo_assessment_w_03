$(document).ready(function () {
    getData();
    $('#submit').on('click', postAnimal);
});

function getData() {
    $.ajax({
        type: 'GET',
        url: '/zoo_animals',
        success: function(data) {
            appendAnimal(data);
        }
    });
}

function postAnimal() {
    event.preventDefault();
    var values = {};

    $.each($('#zooForm').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });
    console.log(numberAnimals());
    //values.number = getRandom();
    values.number = numberAnimals();
    console.log(values.number);

    console.log(values);

    $.ajax({
        type: 'POST',
        url: '/zoo_animals',
        data: values,
        success: function(data) {
            if(data) {
                console.log('from server: ', data);
                getData();
            } else {
                console.log('error');
            }
        }
    });
}

function numberAnimals() {
    $.ajax({
        type: 'GET',
        url: '/random',
        success: function(data) {
            console.log(data);
        }
    });
}

function appendAnimal(info) {
    $('#animal-list').empty();
    for (var i = 0; i < info.length; i++) {
        $('#animal-list').append('<div class="new-animal"></div>');
        var $el = $('#animal-list').children().last();
        $el.append('<p>Type of animal: ' + info[i].animal + '</p>');
        $el.append('<p>Number of animal(s): ' + info[i].number + '</p>');
    }
}

function getRandom() {
    function randomNumber(min, max){ return Math.floor(Math.random() * (1 + max - min) + min); }
    return randomNumber(1, 100);
}