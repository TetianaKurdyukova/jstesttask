var squares = new Array();

const CREATE_FREQ = 1500; // 1.5 sec
const MAX_SPEED = 4; // 4px
const SQUARE_WIDTH = 20;
var createOn = now() + getRandomInt(1000, CREATE_FREQ);

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
    recalc();
    render();
    requestAnimationFrame(animate);
}

document.body.onload = animate;
