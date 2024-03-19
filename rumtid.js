let diagram;
let context;
let diagramWidth = 700;
let diagramHeight = 700;
let origoX = diagramWidth / 2;
let origoY = diagramHeight / 2;
let unitSize = 50;
let u = 0.2

let L = 1

var uSlider = document.getElementById("uSlider");
var uText = document.getElementById("u");
uSlider.value = u;
uText.textContent = u;

var LInput = document.getElementById("LInput");
LInput.value = L;

LInput.oninput = function() {
    L = Linput.value;
}

uSlider.oninput = function() {
  u = uSlider.value;
  uText.textContent = uSlider.value;
  draw_diagram();
}

window.onload = function() {
    draw_diagram()
}

function draw_diagram() {
    diagram = document.getElementById("diagram");
    diagram.width = diagramWidth;
    diagram.height = diagramHeight;
    context = diagram.getContext("2d");
    context.font = "18px serif"
    context.beginPath();
    // x
    arrow(context,
        origoX - diagramWidth / 2,
        origoY,
        origoX + diagramWidth / 2,
        origoY);
    context.fillText("x", origoX + diagramWidth / 2 - 12, origoY - 8);
    length_marker(context,
        origoX + unitSize,
        origoY,
        1,
        0,
        10);
    context.fillText("1m", origoX + unitSize - 10, origoY + 18);
    
    // ct
    arrow(context,
        origoX,
        origoY + diagramWidth / 2,
        origoX,
        origoY - diagramWidth / 2);
        context.fillText("ct", origoX + 6, origoY - diagramWidth / 2 + 12);
    length_marker(context,
        origoX,
        origoY - unitSize,
        0,
        1,
        10);
    context.fillText("1m", origoX - 30, origoY - unitSize + 4);
    // ljuslinje
    dotted_line(context,
        0,
        diagramHeight,
        diagramWidth,
        0,
        5);
    
    // x'
    arrow(context,
        origoX - diagramWidth/2,
        origoY + diagramHeight/2*u,
        origoX + diagramWidth/2,
        origoY - diagramHeight/2*u,
        0);
    context.fillText("x'", origoX + diagramWidth / 2 - 12, origoY- diagramHeight/2*u - 8);
    x_p_angle = Math.atan2(u, 1);
    length_marker(context,
        origoX + Math.cos(x_p_angle) * unitSize / gamma(u),
        origoY + Math.sin(x_p_angle) * unitSize / gamma(u),
        1,
        0,
        10);
    // ct'
    arrow(context,
        origoX - diagramWidth/2*u,
        origoY + diagramHeight/2,
        origoX + diagramWidth/2*u,
        origoY - diagramHeight/2);
        context.fillText("ct'", origoX + diagramWidth/2*u + 6, origoY - diagramWidth / 2 + 12);
    
    measure(context, origoX + 5, origoY + 5, origoX + 30, origoY + 60);


    context.stroke();
}

function line(context, fromx, fromy, tox, toy) {
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
}

function dotted_line(context, fromx, fromy, tox, toy, step_length) {
    var dx = tox - fromx;
    var dy = toy - fromy;
    var lines = Math.sqrt(dx**2 + dy**2)/step_length
    context.moveTo(fromx, fromy);
    for (let i = 0; i < lines; i+=2){
        context.moveTo(fromx + dx / lines * i, fromy + dy / lines * i)
        context.lineTo(fromx + dx / lines * (i+1), fromy + dy / lines * (i+1))
    }
}

function arrow(context, fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function length_marker(context, x, y, dx, dy, barlength) {
    angle = Math.atan2(dy, dx);
    line(context, x - barlength*Math.sin(angle)/2, y + barlength*Math.cos(angle)/2, x + barlength*Math.sin(angle)/2, y - barlength*Math.cos(angle)/2);
}

function measure(context, fromx, fromy, tox, toy, length) {
    var barlen = 10;
    var dx = tox - fromx;
    var dy = toy - fromy;
    line(context, fromx, fromy, tox, toy);
    length_marker(context, fromx, fromy, dx, dy, barlen);
    length_marker(context, tox, toy, dx, dy, barlen);
    //line(context, fromx - barlen*Math.sin(angle)/2, fromy + barlen*Math.cos(angle)/2, fromx + barlen*Math.sin(angle)/2, fromy - barlen*Math.cos(angle)/2);
    //line(context, tox - barlen*Math.sin(angle)/2, toy + barlen*Math.cos(angle)/2, tox + barlen*Math.sin(angle)/2, toy - barlen*Math.cos(angle)/2);
    context.fillText("L = " + length, origoX + diagramWidth / 2 - 12, origoY - 8);
}

function gamma(u) {
    return 1/Math.sqrt(1-u**2);
}