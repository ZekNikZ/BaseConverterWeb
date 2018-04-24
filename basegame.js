var inputEnabled = false;
var correctQuestions = 0;
var maxQuestions = 0;
var time = 0;
var maxTime = 0;

var answer;
var base;
var target;

var bases = [2, 8, 10, 16];
var baseNames = ['binary', 'octal', 'decimal', 'hexadecimal'];

var mode;

var interval;

function setup() {
    document.addEventListener('keydown', function (event) {
        handleKeyDown(event);
    });
    setupMainMenu();
}

function setupMainMenu() {
    clearContentDiv();
    constructButtonSet(function(num){
        clearContentDiv();
        createNewPracticeGame(num);
    }, 'Practice Mode', 'conversions', 5, 10, 25, 50, 100);

    constructButtonSet(function(num){
        clearContentDiv();
        createNewTimeGame(num);
    }, 'Time Mode', 'seconds', 30, 60, 90, 120, 150, 300);
}

function constructButtonSet(callback, name, label) {
    var resultDiv = $('<div/>', {
        class: 'main-menu-btn-group text-center'
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
    $('.content').append(resultDiv);
}

function clearContentDiv() {
    $('.content').empty();
}

function createNewPracticeGame(conversions) {
    correctQuestions = 0;
    time = 0;
    maxTime = 0;
    inputEnabled = true;
    maxQuestions = conversions;
    mode = 'practice';
    constructGame();
    newQuestion();
    startGame();
}

function createNewTimeGame(seconds) {
    correctQuestions = 0;
    maxQuestions = 0;
    inputEnabled = true;
    time = seconds;
    maxTime = seconds;
    mode = 'time';
    constructGame();
    newQuestion();
    startGame();
}

function constructGame() {
    var jumbotron = $('<div/>', {
        class: 'jumbotron'
    });
    jumbotron.append($('<p/>', {
        class: 'question',
        html: '<span class="qnum">12AB</span> <span class="qbase">octal</span> <br/> to <span class="qtarget">hexadecimal</span>'
    }));
    $('.content').append(jumbotron);

    var input = $('<p/>', {
        class: 'input',
        text: '_'
    });
    $('.content').append(input);
    constructScoreDisplay();
    updateScoreDisplay();
}

function handleKeyDown(event) {
    if (!inputEnabled) return;
    var text = $('.input').text();
    if (48 <= event.which && event.which <= 57) {
        handleKeyPress(String.fromCharCode(event.which));
    } else if (65 <= event.which && event.which <= 70) {
        handleKeyPress(String.fromCharCode(event.which).toUpperCase());
    } else if (97 <= event.which && event.which <= 102) {
        handleKeyPress(String.fromCharCode(event.which).toUpperCase());
    } else if (event.which == 8) {
        if (text != '_') {
            if (text.length - 1 == 0) {
                $('.input').text('_');
            } else {
                $('.input').text(text.substring(0, text.length - 1));
            }
        }
    } else if (event.which == 27) {
        $('.input').text('_');
    } else if (event.which == 13) {
        if (parseInt(text, bases[target]) == answer) {
            respondToInput(true);
        } else {
            respondToInput(false);
        }
    }
} 

function handleKeyPress(char) {
    if ($('.input').text() == '_') {
        $('.input').text(char);
    } else {
        $('.input').text($('.input').text() + char);
    }
}

function newQuestion() {
    base = randInt(0, 4);
    target = randInt(0, 4);
    if (base == target) target = (target + 1) % bases.length;
    $('.qbase').text(baseNames[base]);
    $('.qtarget').text(baseNames[target]);

    //answer = randInt(0, 4096);
    answer = randInt(0, 256);
    $('.qnum').text(answer.toString(bases[base]).toUpperCase());
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function respondToInput(correct) {
    if (mode == 'time') maxQuestions++;
    if (correct) {
        $('.input').addClass('green');
        correctQuestions++;
    } else {
        $('.input').addClass('red');
    }
    inputEnabled = false;
    let c = correct;
    setTimeout(function() {
        inputEnabled = true;
        $('.input').removeClass('green');
        $('.input').removeClass('red');
        if (mode == 'time' || c) newQuestion();
        if (mode == 'practice' && correctQuestions >= maxQuestions) {
            endGame();
        }
        $('.input').text('_');
    }, 300);
    updateScoreDisplay();
}

function constructScoreDisplay() {
    var scoreDiv = $('<div/>', {
        class: 'text-center'
    });
    scoreDiv.append($('<p/>', {
        class: 'score',
        html: '<span class="stime">XX:XX</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="squestions">4</span>/<span class="smaxquestions">50</span>'
    }));
    $('.content').append(scoreDiv);
}

function updateScoreDisplay() {
    $('.stime').text((Math.floor(time / 60)) + ':' + pad(Math.floor(time % 60), 2));
    $('.squestions').text(correctQuestions);
    $('.smaxquestions').text(maxQuestions);
    $('.smaxtime').text((Math.floor(maxTime / 60)) + ':' + pad(Math.floor(maxTime % 60), 2));
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function startGame() {
    interval = setInterval(update, 1000);
}

function update() {
    if (mode == 'time') {
        time -= 1;
        if (time <= 0) {
            endGame();
        }
    } else {
        time += 1;
    }
    updateScoreDisplay();
}

function endGame() {
    inputEnabled = false;
    clearInterval(interval);
    clearContentDiv();
    constructGameOver();
}

function constructGameOver() {
    var jumbotron = $('<div/>', {
        class: 'jumbotron'
    });
    jumbotron.append($('<p/>', {
        class: 'gameover',
        text: 'Game Over!'
    }));
    $('.content').append(jumbotron);
    if (mode == 'time') {
        $('.content').append($('<p/>', {
            class: 'result',
            html: 'You did <span class="squestions bold">0</span> conversion' + ((correctQuestions == 1) ? '.' : 's.')
        }));
        $('.content').append($('<p/>', {
            class: 'settings',
            html: 'Time Limit: <span class="smaxtime"></span><br/>Successful Conversions: <span class="squestions">A</span>/<span class="smaxquestions">B</span>'
        }));
    } else {
        $('.content').append($('<p/>', {
            class: 'result',
            html: 'It took you <span class="stime bold">XX:XX</span> to do the conversions.'
        }));
        $('.content').append($('<p/>', {
            class: 'settings',
            html: 'Number of Conversions: <span class="smaxquestions">B</span>'
        }));
    }
    var buttons = $('<div/>', {class: 'text-center'});
    buttons.append($('<button/>', {
        class: 'btn btn-primary btn-lg',
        text: 'Main Menu',
        onclick: 'setupMainMenu()'
    }));
    $('.content').append(buttons);
    updateScoreDisplay();
}