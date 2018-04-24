function setupMainMenu() {
    $('.content').append(constructButtonSet(function(num){
        alert(num);
        clearContentDiv();
    }, 'Practice Mode', 'conversions', 10, 25, 50, 100));

    $('.content').append(constructButtonSet(function(num){
        alert(num);
        clearContentDiv();
    }, 'Time Mode', 'seconds', 60, 90, 120, 150, 300));
}

function constructButtonSet(callback, name, label) {
    var resultDiv = $('<div/>', {
        class: 'main-menu-btn-group'
    });
    resultDiv.append($('<h2/>', {
        text: name
    }));
    var buttonDiv = $('<div/>', {
        class: 'btn-group'
    });
    for (var i = 3; i < arguments.length; i++) {
        let j = arguments[i];
        buttonDiv.append($('<button/>', {
            class: 'btn btn-primary btn-lg game-btn',
            text: arguments[i] + ' ' + label,
            click: function() { callback(j); }
        }));
    }
    resultDiv.append(buttonDiv);
    return resultDiv;
}

function clearContentDiv() {
    $('.content').empty();
}