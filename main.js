const CREATE_FREQ = 1500; // 1.5 sec
const MAX_SPEED = 5; // 5px
const SQUARE_WIDTH = 30;
const EXPLODE_STEPS = 8;

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
        y: 0,
        exploding: false,
        explodeStep: EXPLODE_STEPS
    };
}

function recalc() {
    var canvas = document.getElementById('canvas');

    // create
    if (now() > createOn) {
        squares.push(createNewSquare(canvas));
        createOn = now() + getRandomInt(1000, CREATE_FREQ);
    }

    // clean
    squares = squares.filter(function(s) {
        return s.y < canvas.clientHeight && s.explodeStep > 0;
    });
    
    squares.forEach(function(s) {
        // move
        s.y += s.speed;
        
        // animate explodes
        if (s.exploding && s.explodeStep > 0) {
            s.explodeStep--;
        }
    });
}

function render() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientWidth);
    var img = document.getElementById('bomb');
    
    squares.forEach(function(s) {
        if (!s.exploding) {
            ctx.fillStyle = s.color;
            // x, y, size_left, size_top
            ctx.fillRect(s.x, s.y, s.size, s.size);
        } else {
            var xOffset = (EXPLODE_STEPS - 1) * SQUARE_WIDTH - SQUARE_WIDTH * s.explodeStep;
            ctx.drawImage(img, xOffset, 0, SQUARE_WIDTH, SQUARE_WIDTH, s.x, s.y, s.size, s.size);
        }
    });
}

function animate() {
    if(!continueAnimating){return;}
    recalc();    
    render();
    requestAnimationFrame(animate);  
}

function startExploding(s) {
    score++;
    document.getElementById('score').innerText = score;
    
    s.exploding = true;
    s.speed = 0;
}

function canvasClick(event) {
    var canvas = document.getElementById('canvas');
    var relativeX = event.clientX - canvas.offsetLeft;
    var relativeY = event.clientY - canvas.offsetTop;

    squares.forEach(function(s) {
        if (inSquare(s, relativeX, relativeY)) {
            startExploding(s);
        }
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

