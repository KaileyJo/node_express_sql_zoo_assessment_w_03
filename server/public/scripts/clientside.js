var zooCapacity = 0;
var netWorth = 0;
var animalWorth = 0;

$(document).ready(function () {
    getData();
    $('#submit').on('click', postAnimal);
    $('#animal-list').on('click', '.sell-cause-broke', sellAnimals);
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

function appendAnimal(info) {
    $('#animal-list').empty();
    for (var i = 0; i < info.length; i++) {
        var animalName = info[i].animal;
        var animalNumber = info[i].number;
        animalCost = (animalName.length) * 2000 + animalNumber * 3;
        animalWorth = animalCost * animalNumber;
        netWorth += animalWorth;
        $('#animalDollars').text(netWorth);
        $('#animal-list').append('<div class="new-animal"></div>');
        var $el = $('#animal-list').children().last();
        $el.append('<p>Type of animal: ' + animalName + '</p>');
        $el.append('<p>One ' + animalName + ' is worth $' + animalCost + '</p>');
        $el.append('<p>Number of animal(s): <span class="the-number">' + animalNumber + '</span></p>');
        $el.append('<p>The worth of our ' + animalName + ' population is: $<span class="monetary-value">' + animalWorth + '</span></p>')
        $el.append('<button class="sell-cause-broke">Sell Aminals :(</button>');
        zooCapacity += info[i].number;
        $('#capacity').text(zooCapacity);
    }
}

function sellAnimals() {
    var $el = $(this).parent();
    var $number = $el.find('.the-number');
    var newNumber = parseInt($number.text());
    var $value = $el.find('.monetary-value');
    var moneyValue = parseInt($value.text());
    var worth = moneyValue/newNumber;
    var animalDollars = parseInt($('#animalDollars').text());
    var capacity = parseInt($('#capacity').text());
    if(newNumber > 0) {
        moneyValue -= worth;
        animalDollars -= worth;
        $('#animalDollars').text(animalDollars);
        $el.find('.monetary-value').text(moneyValue);
        newNumber--;
        capacity--;
        $('#capacity').text(capacity);
        $number.text(newNumber);
    }
}