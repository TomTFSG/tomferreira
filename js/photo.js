let speaker,bg;
const space = 10;
let baseX = [];
let baseY = [];
let currX = [];
let currY = [];
let cols = 0;
let rows = 0;
let rand = [];
let storedColor = [];
let isColored = [];

function preload() {
    speaker = loadImage('../img/data/original.jpg');
    bg = loadImage('../img/data/original.png');
}

function setup() {
    const old = document.getElementById('canvas');
    if (old) old.remove();

    const cw = Math.floor(windowWidth / 2);
    const ch = Math.round(cw * (speaker.height / speaker.width));
    const cnv = createCanvas(cw, ch);

    const mainEl = select('main');
    if (mainEl) cnv.parent(mainEl);
    cnv.id('canvas');

    speaker.resize(width, height);

    initGrid();

    noStroke();
    setBioSize();
}

function initGrid() {
    cols = Math.floor(speaker.width / space);
    rows = Math.floor(speaker.height / space);

    baseX = new Array(cols);
    baseY = new Array(cols);
    currX = new Array(cols);
    currY = new Array(cols);
    rand = new Array(cols);
    storedColor = new Array(cols);
    isColored = new Array(cols);
    
    for (let i = 0; i < cols; i++) {
        baseX[i] = new Array(rows);
        baseY[i] = new Array(rows);
        currX[i] = new Array(rows);
        currY[i] = new Array(rows);
        rand[i] = new Array(rows);
        storedColor[i] = new Array(rows);
        isColored[i] = new Array(rows);
        for (let j = 0; j < rows; j++) {
            baseX[i][j] = i * space;
            baseY[i][j] = j * space;
            currX[i][j] = baseX[i][j];
            currY[i][j] = baseY[i][j];

            rand[i][j] = random(0, 3);

            storedColor[i][j] = color(255);
            isColored[i][j] = false;
        }
    }

}

function draw() {
    background(0);

    const radius = 100;
    const repelStrength = 10000;
    const ease = 0.5;

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = i * space;
            const y = j * space;

            const dx = mouseX - currX[i][j];
            const dy = mouseY - currY[i][j];
            const distSq = dx * dx + dy * dy;
            const distVal = Math.sqrt(distSq);

            if (distVal < radius && distVal > 0) {
                const force = repelStrength / distSq;
                const angle = Math.atan2(dy, dx);
                currX[i][j] -= Math.cos(angle) * force;
                currY[i][j] -= Math.sin(angle) * force;
            } else {
                currX[i][j] += (baseX[i][j] - currX[i][j]) * ease;
                currY[i][j] += (baseY[i][j] - currY[i][j]) * ease;
            }

            const c = speaker.get(x, y);
            /*
            const b = brightness(c);
            const size = space * 0.8;

            fill(c);
            */

            let rc, gc, bc;
            if (Array.isArray(c) && c.length >= 3) {
                rc = c[0];
                gc = c[1];
                bc = c[2];
            } else {
                rc = red(c);
                gc = green(c);
                bc = blue(c);
            }
            const WHITE_THRESHOLD = 190;
                if (rc >= WHITE_THRESHOLD && gc >= WHITE_THRESHOLD && bc >= WHITE_THRESHOLD) {
                    continue;
                }

            let b = brightness(c);
            let norm;
            if (isNaN(b)) {
                if (Array.isArray(c) && c.length >= 3) {
                    norm = (c[0] + c[1] + c[2]) / (3 * 255);
                } else {
                    norm = 1;
                }
            } else {
                norm = constrain(b / 100, 0, 1);
            }

            const size = space * 0.2 + (space * 0.8) * norm;
            
            const baseDist = dist(currX[i][j], currY[i][j], baseX[i][j], baseY[i][j]);
            const RETURN_THRESHOLD = 1.0;

            if (baseDist > RETURN_THRESHOLD && !isColored[i][j]) {
                // assign a random color once when displaced
                /*storedColor[i][j] = color(
                    random(50, 255),
                    random(50, 255),
                    random(50, 255)
                );
                */
                storedColor[i][j] = c;
                //storedColor[i][j] = color(255);
                isColored[i][j] = true;
            } else if (baseDist <= RETURN_THRESHOLD && isColored[i][j]) {
                // back to base -> reset to white
                storedColor[i][j] = color(255);
                //storedColor[i][j] = c;
                isColored[i][j] = false;
            }

            // draw using the stored color (white when at rest)
            fill(storedColor[i][j]);
            rectMode(CENTER);
            if (rand[i][j] < 1) {
                rect(currX[i][j], currY[i][j], size, size);
            } else if (rand[i][j] < 2) {
                circle(currX[i][j], currY[i][j], size);
            } else {
                drawTriangle(currX[i][j], currY[i][j], size, (i + j) % 2 === 0);
            }
        }
    }
}

function drawTriangle(x, y, s, up) {
    const h = (Math.sqrt(3) / 2) * s;
    if (up) {
        triangle(
            x, y - h / 2,
            x - s / 2, y + h / 2,
            x + s / 2, y + h / 2
        );
    } else {
        triangle(
            x, y + h / 2,
            x - s / 2, y - h / 2,
            x + s / 2, y - h / 2
        );
    }
}

function windowResized() {
    const cw = Math.floor(windowWidth / 2);
    const ch = Math.round(cw * (speaker.height / speaker.width));
    resizeCanvas(cw, ch);
    speaker.resize(width, height);
    initGrid();
    setBioSize();
}

function setBioSize() {
    const bio = document.querySelector('.bio');
    const canvasEl = document.getElementById('canvas');
    if (!bio || !canvasEl) return;

    // match width/height in pixels
    //bio.style.width = canvasEl.width + 'px';
    bio.style.height = height + 'px';

    // optionally align bio vertically with the canvas top
    const canvasRect = canvasEl.getBoundingClientRect();
    // place bio at same top as canvas (relative to document)
    //bio.style.position = 'absolute';
    //bio.style.top = (window.scrollY + canvasRect.top) + 'px';

    // place bio to the right of the canvas (adds 10px gap)
    //bio.style.left = (canvasRect.left + canvasEl.width + 10) + 'px';
}