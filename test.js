let exampleShader;
let targetImage;

function preload() {
    exampleShader = loadShader('abura.vert', 'abura.frag');
    targetImage = loadImage('target.jpg', img => {
        console.log("Image loaded successfully");
    }, img => {
        console.log("Image failed to load");
    });
}

function setup() {
    createCanvas(targetImage.width, targetImage.height, WEBGL); 
    noStroke();
}

function draw() {
    clear();
    
    // Use the shader for the rectangle
    shader(exampleShader);

    // Set uniforms inside the draw function
    exampleShader.setUniform("u_target", targetImage);
    exampleShader.setUniform("u_targetSize", [targetImage.width, targetImage.height]);

    // Render the rectangle
    rect(0, 0, width, height); 
}
