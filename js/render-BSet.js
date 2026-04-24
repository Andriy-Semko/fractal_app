const slider_re = document.getElementById('re_z_value');
const slider_im = document.getElementById('im_z_value');
const slider_iter = document.getElementById('iteration');

const re_out = document.getElementById('re_z_output');
const im_out = document.getElementById('im_z_output');
const iter_out = document.getElementById('iteration_output');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// --
re_out.textContent = slider_re.value;
im_out.textContent = slider_im.value;
iter_out.textContent = slider_iter.value;

//--
let step = 0.01;
let moveStepX = 0;
let moveStepY = 0;
addEventListener('keyup', (event) => {
    console.log(event);
    switch (event.code){
        case 'KeyW':
            moveStepY += step;
            break;
        case 'KeyS':
            moveStepY -= step;
            break
        case 'KeyA':
            moveStepX += step;//-
            break
        case 'KeyD':
            moveStepX -= step;//+
            break;
    }
    safeDraw();
});

let s = 1;

addEventListener('wheel', (scale) => {
    if (100 * 0.0001 > s + scale.deltaY * 0.0001){
        return;
    }
    s += scale.deltaY * 0.0001;
    
    console.log(s);
    safeDraw();
});
slider_re.addEventListener('input', () => {
    re_out.textContent = slider_re.value;
    safeDraw();
});

slider_im.addEventListener('input', () => {
    im_out.textContent = slider_im.value;
    safeDraw();
});

slider_iter.addEventListener('input', () => {
    iter_out.textContent = slider_iter.value;
    safeDraw();
});

function belongsFast(re, im, maxIter, c_re, c_im) {
    let z_re = re;
    let z_im = im;

    let i = 0;

    while (z_re * z_re + z_im * z_im < 4 && i < maxIter) {
        let new_re = z_re * z_re - z_im * z_im + c_re;
        let new_im = 2 * z_re * z_im + c_im;

        z_re = new_re;
        z_im = new_im;

        i++;
    }

    return i;
}

function draw(width, height, maxIter) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    
    const c_re = parseFloat(slider_re.value);
    const c_im = parseFloat(slider_im.value);

    //область
    const minRe = -2 * -s + moveStepX, maxRe = 2 * -s + moveStepX;
    const minIm = -1 * -s + moveStepY, maxIm = 1 * -s + moveStepY;
    
    const reStep = (maxRe - minRe) / width;
    const imStep = (maxIm - minIm) / height;

    let index = 0;

    for (let y = 0; y < height; y++) {
        let im = minIm + y * imStep;

        for (let x = 0; x < width; x++) {
            let re = minRe + x * reStep;

            let iter = belongsFast(re, im, maxIter, c_re, c_im);

            let r, g, b;

            if (iter >= maxIter) {
                r = g = b = 0;
            } else {

                let t = iter / maxIter;

                //r = 255 * t;
                //g = 255 * (1 - t);
                //b = 150 + 100 * t;
                r = 9 * (1 - t) * t * t * t * 255;
                g = 15 * (1 - t) * (1 - t) * t * t * 255;
                b = 8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255;
            }

            data[index++] = r;
            data[index++] = g;
            data[index++] = b;
            data[index++] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

let timeout;

function safeDraw() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        draw(canvas.width, canvas.height, parseInt(slider_iter.value));
    }, 30);
}

safeDraw();