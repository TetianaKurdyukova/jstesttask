const CREATE_FREQ = 1500; // 1.5 sec
const MAX_SPEED = 5; // 5px
const SQUARE_WIDTH = 30;

var squares = new Array();
var createOn = now() + getRandomInt(1000, CREATE_FREQ);
var score = 0;
// flag controlling if the animation will continue or stop
var continueAnimating = true;

function now() {
    return new Date().getTime();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function createNewSquare(canvas) {
    return {
        size: SQUARE_WIDTH,
        color: getRandomColor(),
        speed: getRandomInt(1, MAX_SPEED),
        x: getRandomInt(0, canvas.clientWidth - SQUARE_WIDTH),
        y: 0
    };
}

function recalc() {
    var canvas = document.getElementById('canvas');

    // create
    if (now() > createOn) {
        squares.push(createNewSquare(canvas));
        createOn = now() + getRandomInt(1000, CREATE_FREQ);
    }
    
    // move
    squares.forEach(function(s) {
        s.y += s.speed;
    });
    
    // clean
    squares = squares.filter(function(s) {
        return s.y < canvas.clientHeight;
    });
}

function render() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);
    
    squares.forEach(function(s) {
        ctx.fillStyle = s.color;
        // x, y, size_left, size_top
        ctx.fillRect(s.x, s.y, s.size, s.size);
    });
}

function animate() {
    if(!continueAnimating){return;}
    recalc();    
    render();
    requestAnimationFrame(animate);  
}

function canvasClick(event) {
    var canvas = document.getElementById('canvas');
    var relativeX = event.clientX - canvas.offsetLeft;
    var relativeY = event.clientY - canvas.offsetTop;

    squares = squares.filter(function(s) {
        if (inSquare(s, relativeX, relativeY)) {
            score++;
            document.getElementById('score').innerText = score;
            // do not copy
            return false;
        }
        return true;
    });
}

function inSquare(s, x, y) {
    return s.x <= x && x <= (s.x + s.size) && s.y <= y && y <= (s.y + s.size);
}

function startGame() {
    score = 0;
    document.getElementById('score').innerText = score;

    continueAnimating = true;
    animate();
}

function stopGame() {
    continueAnimating = false;
    
    squares = new Array();

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);
}

document.body.onload = function() {
    document.getElementById('canvas').onclick = canvasClick;
    document.getElementById('start').onclick = startGame;
    document.getElementById('stop').onclick = stopGame;    
};

