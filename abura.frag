#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_canvas;
uniform sampler2D u_target;      // Target image
uniform vec2 u_targetSize;       // Size of the target image

varying vec2 pos;

void main() {
    // Flip the y-coordinate for texture mapping
    vec2 flippedUV = vec2(pos.x , 1.0 - pos.y);
    vec2 flippedCanvasUV = vec2(flippedUV.x + u_targetSize.x/2.0, flippedUV.y + u_targetSize.y/2.0);

    // Sample the target color from flipped coordinates
    vec4 targetColor = texture2D(u_target, flippedUV);
    vec4 canvasColor = texture2D(u_canvas, flippedUV);
    vec4 diff = vec4(
        abs(targetColor.r-canvasColor.r),
        abs(targetColor.g-canvasColor.g),
        abs(targetColor.b-canvasColor.b),
        1.0
    );
    // Output the target color
    gl_FragColor = diff;
}
