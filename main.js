let targetImage
let strokes = []
const NUM = 20
const GEN = 2
const MUTATION = 5
const TOP = 2
let offscreen
let fbo
let canvas

function mean(arr) {
    const sum = arr.reduce((acc, value) => acc + value, 0)
    return sum / arr.length
}

function getAvgColor() {
    targetImage.loadPixels()
    let pixelArray = []
  
    for (let i = 0; i < targetImage.pixels.length; i += 4) {
        // Get the grayscale value (since it's black-and-white)
        let avg = (targetImage.pixels[i] + targetImage.pixels[i + 1] + targetImage.pixels[i + 2]) / 3
        pixelArray.push(avg)
    }

    return mean(pixelArray)
}

function generateStroke() {
    console.log(`Generating stroke ${strokes.length} ...`);
    
    let batch = Array.from({ length: NUM }, () => createStroke());

    for (let j = 0; j < GEN; j++) {
        const betterBatch = batch.sort((a, b) => getScore(a) - getScore(b)).slice(0, TOP);

        batch = betterBatch.flatMap(stroke =>
            Array.from({ length: NUM / TOP }, () => createStroke(stroke))
        );
    }

    let bestStroke = batch.reduce((best, stroke) => (getScore(stroke) < getScore(best) ? stroke : best));
    strokes.push(bestStroke)

    return bestStroke
}


function createStroke(stroke) {
    if (stroke) {
        let mutationAmount = MUTATION;
        let newGray = Math.max(0, Math.min(255, stroke.color[0] + random(-mutationAmount, mutationAmount)))

        return {
            rectWidth: Math.max(1, stroke.rectWidth + random(-mutationAmount, mutationAmount)),
            rectHeight: Math.max(1, stroke.rectHeight + random(-mutationAmount, mutationAmount)),
            rectPosX: stroke.rectPosX + random(-mutationAmount, mutationAmount),
            rectPosY: stroke.rectPosY + random(-mutationAmount, mutationAmount),
            color: [
                newGray,
                newGray,
                newGray
            ]
        };
    }
    else {
        let rectWidth = random(1, 200);
        let rectHeight = random(1, 200);
        let rectPosX = random(-width / 2, width / 2 - rectWidth);
        let rectPosY = random(-height / 2, height / 2 - rectHeight);
        let gray = random(0, 255);

        return {
            rectWidth,
            rectHeight,
            rectPosX,
            rectPosY,
            color: [gray, gray, gray]
        };
    }
}

function getScore(stroke) {
    fbo.clear()
    fbo.resetShader()
    fbo.image(get(), -width/2, -height/2, width, height)
    fbo.background(getAvgColor()) 
    if (stroke) {
        drawStroke(stroke, fbo)
    }
    
    fbo.shader(exampleShader);
    exampleShader.setUniform("u_target", targetImage);
    exampleShader.setUniform("u_targetSize", [targetImage.width, targetImage.height]);

    exampleShader.setUniform("u_canvas", fbo);

    fbo.rect(-width / 2, -height / 2, width, height);

    let score = 0;
    fbo.loadPixels()
    for (let i = 0; i < fbo.pixels.length; i += 4) {
        score += fbo.pixels[i];
    }

    return score;
}

function drawStroke(stroke, target) {
    if (target) {
        target.fill(stroke.color)
        target.rect(stroke.rectPosX, stroke.rectPosY, stroke.rectWidth, stroke.rectHeight)
    }
    else {
        fill(stroke.color)
        rect(stroke.rectPosX + width/2, stroke.rectPosY + height/2, stroke.rectWidth, stroke.rectHeight)
    }
}

function preload() {
    exampleShader = loadShader('abura.vert', 'abura.frag')
    targetImage = loadImage('target.jpg')
}

function setup() {
    canvas = createCanvas(targetImage.width, targetImage.height);
    canvas.drawingContext = canvas.canvas.getContext('2d', { willReadFrequently: true });

    fbo = createGraphics(targetImage.width, targetImage.height, WEBGL);
    fbo.noStroke();
    noStroke();
    background(getAvgColor())
}

function draw() {
    let newStroke = generateStroke()
    drawStroke(newStroke)
}
