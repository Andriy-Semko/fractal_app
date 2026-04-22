var slider_re_z_value = document.getElementById('re_z_value');
var slider_im_z_value = document.getElementById('im_z_value');
var slider_iteration_value = document.getElementById('iteration');
const re_z_output = document.getElementById('re_z_output');
const im_z_output = document.getElementById('im_z_output');
const iteration_output = document.getElementById('iteration_output');
//var minRe = -1.5, maxRe = -1.2, minIm = -0.1, maxIm = 0.1;
var step = 0.05;


slider_re_z_value.addEventListener('input', function() {
    // Access the current value using the .value property
    re_z_output.textContent = this.value;
    //slider_re_z_value = parseFloat(this.value);
    safeDraw(500, 350, Number(slider_iteration_value.value));
});
slider_im_z_value.addEventListener('input', function() {
    // Access the current value using the .value property
    im_z_output.textContent = this.value;
    //slider_im_z_value = parseFloat(this.value);
    safeDraw(500, 350, Number(slider_iteration_value.value));
});
slider_iteration_value.addEventListener('input', function() {
    // Access the current value using the .value property
    iteration_output.textContent = Number(this.value);
    safeDraw(500, 350, Number(this.value));
});

/*document.addEventListener('keydown', (event) => {
  if (event.key === 'A') {
    minRe -= step;
    maxRe += step;
    //safeDraw
  }
});*/

function Complex(re, im){
    this.re = re;
    this.im = im;
}

Complex.prototype.add = function(other){
    return new Complex(this.re + other.re, this.im + other.im);
}

Complex.prototype.mul = function(other) {
    return new Complex(this.re* other.re - this.im * other.im, this.re * other.im + this.im * other.re);
}

Complex.prototype.abs = function() {
    return Math.sqrt(this.re * this.re + this.im * this.im);
}

function belongs(re, im, iterations){
    console.log(parseFloat(slider_re_z_value.value), parseFloat(slider_im_z_value.value));
    var c = new Complex(parseFloat(slider_re_z_value.value), parseFloat(slider_im_z_value.value));
    var z = new Complex(re, im);
    //var z = new Complex(0, 0);
    //var c = new Complex(re, im);
    var i = 0;
    while (z.abs() < 2 && i < iterations) {
        z = z.mul(z).add(c);
        i++;
    }

    //var mod = Math.sqrt(z.abs());
    //var smoth = i - Math.log(Math.max(1.0, Math.log2(mod)));
    //return smoth;
    return i;
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function pixel(x, y, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

//function draw(width, height, maxIterations, _minRe, _maxRe, _minIm, _maxIm){
function draw(width, height, maxIterations){
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //var minRe = _minRe, maxRe = _maxRe, minIm = _minIm, maxIm = _maxIm;
    
    //var minRe = -1.5 - 0.05, maxRe = -1.2 - 0.05, minIm = -0.1, maxIm = 0.1;
    //var minRe = -4, maxRe = 4, minIm = -2, maxIm = 0;
    var minRe = -2, maxRe = 2, minIm = -1, maxIm = 1;
    //var minRe = -1.5, maxRe = -1.2, minIm = -0.1, maxIm = 0.1;
    var reStep = (maxRe - minRe) / width, imStep = (maxIm - minIm) / height;
    var re = minRe;
    while (re < maxRe){
        var im = minIm;
        while (im < maxIm){
            var result = belongs(re, im, maxIterations);
            var x = (re - minRe) / reStep, y = (im - minIm) / imStep;
            if (result == maxIterations){
                pixel(x, y, 'black')
            } else {
                var h = 30 + Math.round(120 * result * 1.0 / maxIterations);
                var color = 'hsl(' + h + ', 100%, 50%)';
                pixel(x, y, color)
            }
            im += imStep;
        }
        re += reStep;
    }
}
let timeout;

function safeDraw() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        draw(500, 350, Number(slider_iteration_value.value));
    }, 50);
}
safeDraw();
//draw(700, 450, 550);
//var iterations = [5, 10, 15, 25, 50, 75, 100, 150, 200, 500];
//var i = 0;
//var interval = setInterval(function(){
//    draw(700, 450, iterations[i]);
//    i++
//    if (i >= iterations.length){
//        clearInterval(interval);
//    }
//}, 1000);