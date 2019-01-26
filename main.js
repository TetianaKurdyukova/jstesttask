var squares = new Array();
squares.push({
    size: 20,
    color: '#f0f',
    speed: 1,
    x: 320,
    y: 0
});

var currentPos = 0;

function recalc() {
    var canvas = document.getElementById('canvas');
    // create
    
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
    
    squares.forEach( function(s) {
        // x, y, size_left, size_top
        ctx.fillRect(s.x, s.y, s.size, s.size);
        ctx.fillStyle = s.color;
    });
}

function animate() {
    recalc();
    render();
    requestAnimationFrame(animate);
}

document.body.onload = animate;
