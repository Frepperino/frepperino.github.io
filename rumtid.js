let diagram;
let context;
let diagramWidth = 700;
let diagramHeight = 700;
let origoX = diagramWidth / 2;
let origoY = diagramHeight / 2;
let unitSize = 120;
let u = 0.2;

let t = 0;

let Lp = 1;
let x_t0 = 0;

let defaultL = 1;
let defaultu = 0.5;
let defaultx_t0 = 0;

let objectsData = {};

var addObjectBtn = document.getElementById("addObjectBtn");
var objectsContainer = document.getElementById("objectsContainer");
var nextObjId = 0;

addObjectBtn.addEventListener("click", function () {
    var objectDiv = document.createElement("div");
    var objId = nextObjId++;
    objectDiv.classList.add("object");
    objectDiv.innerHTML = `
            <label for="speed${objId}">Speed:</label>
            <input type="range" min="0" max="1" value="0" step="0.01" id="uSlider">
            <input type="number" id="speed${objId}" name="speed${objId}" step="0.01" required>
            <label for="length${objId}">Length:</label>
            <input type="number" id="length${objId}" name="length${objId}" required>
            <label for="x_t0${objId}">x at t = 0:</label>
            <input type="number" id="x_t0${objId}" name="x_t0${objId}" required>
            <button id="remove${objId}" class="removeBtn">Remove</button>
        `;
    objectsContainer.appendChild(objectDiv);

    var speedInput = document.getElementById(`speed${objId}`);
    speedInput.value = defaultu;
    var lengthInput = document.getElementById(`length${objId}`);
    lengthInput.value = defaultL;
    var x_t0Input = document.getElementById(`x_t0${objId}`);
    x_t0Input.value = defaultx_t0;

    speedInput.addEventListener('input', function () {
        setObjectsData(objId);
    });

    lengthInput.addEventListener('input', function () {
        setObjectsData(objId);
    });

    x_t0Input.addEventListener('input', function () {
        setObjectsData(objId);
    });

    // Function to update objectsData array
    function setObjectsData(id) {
        objectsData[id] = { // As array index starts from 0 and objectId starts from 1
            speed: parseFloat(speedInput.value),
            length: parseFloat(lengthInput.value),
            x_t0: parseFloat(x_t0Input.value),
        };
        draw_diagram();
        draw_perspective();
    }

    setObjectsData(objId);

    var removeBtn = document.getElementById(`remove${objId}`);
    removeBtn.addEventListener('click', function () {
        delete objectsData[objId];
        removeBtn.parentNode.remove();
        draw_diagram();
    });

    draw_diagram();
    draw_perspective();
});


var uSlider = document.getElementById("uSlider");
var uText = document.getElementById("u");
uSlider.value = u;
uText.textContent = u;

var tSlider = document.getElementById("tSlider");
var tText = document.getElementById("t");
tSlider.value = t;
tText.textContent = t;


var LpInput = document.getElementById("LpInput");
LpInput.value = Lp;

var LMovingCheck = document.getElementById("LMovingCheck");
var LMovingText = document.getElementById("LMovingText");
LMovingText.value = "L";
LMovingCheck.value = false;

var x_t0Input = document.getElementById("x_t0");
x_t0Input.value = x_t0;

LMovingCheck.oninput = function () {
    LMovingText.value = LMovingCheck.value == true ? "L'" : "L";
    LMoving = LMovingCheck.value;
}

LpInput.oninput = function () {
    L = parseFloat(LpInput.value);
    draw_diagram();
    draw_perspective();
}

uSlider.oninput = function () {
    u = parseFloat(uSlider.value);
    uText.textContent = u;
    draw_diagram();
    draw_perspective();
}

tSlider.oninput = function () {
    t = parseFloat(tSlider.value);
    tText.textContent = t;
    draw_diagram();
    draw_perspective();
}

x_t0Input.oninput = function () {
    x_t0 = parseFloat(x_t0Input.value);
    draw_diagram();
    draw_perspective();
}

window.onload = function () {
    draw_diagram();
    draw_perspective();
}


function draw_perspective() {
    var per = document.getElementById("perspective");
    per.width = 500;
    per.height = 200;
    var con = per.getContext("2d");
    con.font = "18px serif"
    arrow(con, 0, per.height - 25, per.width, per.height - 25);
    length_marker(con, per.width / 2, per.height - 25, 1, 0, 10);
    con.fillText("0", per.width / 2 - 4, per.height - 5);

    for (let key in objectsData) {
        var obj = objectsData[key];
        var u = obj.speed;
        var L = obj.length;
        var x_t = obj.x_t0;

        measure(con, per.width / 2, per.height - 50, per.width / 2 + unitSize * L, per.height - 50, "m");
    }

    // draw_fill(con, [0, per.width, per.width, 0], [0, 0, per.height, per.height]);
}

function draw_diagram() {
    diagram = document.getElementById("diagram");
    diagram.width = diagramWidth;
    diagram.height = diagramHeight;
    context = diagram.getContext("2d");
    context.font = "18px serif"

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
        origoX - diagramWidth / 2,
        origoY + diagramHeight / 2 * u,
        origoX + diagramWidth / 2,
        origoY - diagramHeight / 2 * u,
        0);
    context.fillText("x'", origoX + diagramWidth / 2 - 12, origoY - diagramHeight / 2 * u - 8);
    var x_p_x = origoX + 1 / Math.sqrt(u ** 2 + 1) * unitSize / gamma(u);
    var x_p_y = origoY - u / Math.sqrt(u ** 2 + 1) * unitSize / gamma(u);
    length_marker(context,
        x_p_x,
        x_p_y,
        1,
        -u,
        10);
    context.fillText("1m", x_p_x - 10, x_p_y + 18);

    // ct'
    arrow(context,
        origoX - diagramWidth / 2 * u,
        origoY + diagramHeight / 2,
        origoX + diagramWidth / 2 * u,
        origoY - diagramHeight / 2);
    context.fillText("ct'", origoX + diagramWidth / 2 * u + 6, origoY - diagramWidth / 2 + 12);
    var ct_p_x = origoX + u / Math.sqrt(u ** 2 + 1) * unitSize / gamma(u);
    var ct_p_y = origoY - 1 / Math.sqrt(u ** 2 + 1) * unitSize / gamma(u);
    length_marker(context,
        ct_p_x,
        ct_p_y,
        u,
        -1,
        10);
    context.fillText("1m", ct_p_x - 30, ct_p_y + 4);

    //measure(context, origoX + 5, origoY + 5, origoX + 30, origoY + 60);

    var x_p_0 = 0
    var x_p_1 = Lp
    var t_p_0 = 0
    var t_p_1 = 0

    var x_0 = gamma(u) * (x_p_0 + u * t)
    var x_1 = gamma(u) * (x_p_1 + u * t)
    var t_0 = gamma(u) * (t + u * x_p_0)
    var t_1 = gamma(u) * (t + u * x_p_1)

    for (let key in objectsData) {
        var obj = objectsData[key];
        console.log(obj);
        var u = obj.speed;
        var L = obj.length;
        var x_t = obj.x_t0;
        console.log("x" + x_t);
        console.log("L" + L);
        console.log("sum=" + (x_t + L));
        draw_fill(context,
            [
                origoX - diagramWidth / 2 * u + x_t * unitSize,
                origoX + diagramWidth / 2 * u + x_t * unitSize,
                origoX + diagramWidth / 2 * u + (x_t + L) * unitSize,
                origoX - diagramHeight / 2 * u + (x_t + L) * unitSize,
            ],
            [
                origoY + diagramHeight / 2,
                origoY - diagramHeight / 2,
                origoY - diagramHeight / 2,
                origoY + diagramHeight / 2
            ]
        );
    }

    // draw_fill(context,
    //     [
    //         origoX - diagramWidth / 2 * u + x_t0 * unitSize,
    //         origoX + diagramWidth / 2 * u + x_t0 * unitSize,
    //         origoX + diagramWidth / 2 * u + (x_t0 + Lp) * unitSize,
    //         origoX - diagramHeight / 2 * u + (x_t0 + Lp) * unitSize,
    //     ],
    //     [
    //         origoY + diagramHeight / 2,
    //         origoY - diagramHeight / 2,
    //         origoY - diagramHeight / 2,
    //         origoY + diagramHeight / 2
    //     ]
    // );
    // line(context,
    //     origoX + (x_0 - 5) * unitSize,
    //     origoY - (t - 5) * unitSize,
    //     origoX + (x_0 + 5) * unitSize,
    //     origoY - (t + 5) * unitSize,
    //     10
    // )
    // var t_0 = t

    // var x_p_0 = gamma(u)*(x_0 - u*t) = gamma*(u*t - u*t)
    // var x_p_1 = gamma(u)*(x_1)

    // var t_p_0 = gamma(u)*(t-u*x_0)
    // var t_p_1 = gamma(u)*(t-u*x_1)

    // var t_0 = t
    // var t_1 = gamma(u)*(t_p_1 + u*x_p_1)



    // var t_p_0 = t/gamma(u)-u*x_p_0

    // var x_0 = invlorentzx(x_p_0, u, t)
    // var x_1 = invlorentzx(x_p_1, u, t)
    // var t_p_0 = lorentzt(t, u, x_0)
    // var t_p_1 = lorentzt(t, u, x_1)
    // var x_p_0 = u*t_p_0
    // var x_p_1 = Lp + u*t_p_0
    // var t_0 = t
    // var t_1 = invlorentzt(t_p_1, u, x_p_1)
    // S
    // line(context,
    //     origoX + invlorentzx(0, u, t) * unitSize,
    //     origoY,
    //     origoX + invlorentzx(Lp, u, t) * unitSize,
    //     origoY,
    //     5);
    // measure(context, origoX, origoY, origoX + Lp * unitSize, origoY,  "L = " + Lp + "m");
    // S'
    line(context,
        origoX + x_0 * unitSize,
        origoY - t_0 * unitSize,
        origoX + x_1 * unitSize,
        origoY - t_1 * unitSize,
        5);
    dotted_line(context,
        origoX + x_0 * unitSize,
        origoY - t_0 * unitSize,
        origoX + x_0 * unitSize,
        origoY,
        5
    );
    dotted_line(context,
        origoX + x_1 * unitSize,
        origoY - t_1 * unitSize,
        origoX + x_1 * unitSize,
        origoY,
        5
    );
    //print("hello")
    // measure( context, origoX, origoY, origoX + Lp / Math.sqrt(u**2 + 1) * unitSize / gamma(u), origoY - Lp * u / Math.sqrt(u**2 + 1) * unitSize/gamma(u), "L' = " + Math.round(1 / gamma(u) * 1000)/1000 + "L");
}

function line(context, fromx, fromy, tox, toy, line_width = 1) {
    context.beginPath();
    context.lineWidth = line_width;
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.stroke();
}

function draw_fill(context, xs, ys) {
    context.fillStyle = '#f00';
    context.globalAlpha = 0.5
    context.moveTo(xs[0], ys[0]);
    context.beginPath();

    for (let i = 0; i < xs.length; i++) {
        context.lineTo(xs[i], ys[i]);
    }
    //context.lineTo(xs[0], ys[0]);
    context.closePath();
    context.fill();
    context.fillStyle = '#000'
    context.globalAlpha = 1
}

function dotted_line(context, fromx, fromy, tox, toy, step_length, line_width = 1) {
    context.beginPath();
    context.lineWidth = line_width;
    var dx = tox - fromx;
    var dy = toy - fromy;
    var lines = Math.sqrt(dx ** 2 + dy ** 2) / step_length
    context.moveTo(fromx, fromy);
    for (let i = 0; i < lines; i += 2) {
        context.moveTo(fromx + dx / lines * i, fromy + dy / lines * i)
        context.lineTo(fromx + dx / lines * (i + 1), fromy + dy / lines * (i + 1))
    }
    context.stroke();
}

function arrow(context, fromx, fromy, tox, toy, line_width = 1) {
    context.beginPath();
    context.lineWidth = line_width;
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
}

function length_marker(context, x, y, dx, dy, barlength, line_width = 1) {
    context.beginPath();
    context.lineWidth = line_width;
    var angle = Math.atan2(dy, dx);
    line(context, x - barlength * Math.sin(angle) / 2, y + barlength * Math.cos(angle) / 2, x + barlength * Math.sin(angle) / 2, y - barlength * Math.cos(angle) / 2, line_width);
    context.stroke();
}

function measure(context, fromx, fromy, tox, toy, label, line_width = 1) {
    context.beginPath();
    context.lineWidth = line_width;
    var barlen = 10;
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.fillText(label, origoX + (dx - 30) / 2 - 10 * Math.sin(angle), origoY + dy / 2 - 10 * Math.cos(angle));
    fromx -= 10 * Math.sin(angle);
    tox -= 10 * Math.sin(angle);
    fromy += 10 * Math.cos(angle);
    toy += 10 * Math.cos(angle);
    line(context, fromx, fromy, tox, toy, line_width);
    length_marker(context, fromx, fromy, dx, dy, barlen, line_width);
    length_marker(context, tox, toy, dx, dy, barlen, line_width);
    //line(context, fromx - barlen*Math.sin(angle)/2, fromy + barlen*Math.cos(angle)/2, fromx + barlen*Math.sin(angle)/2, fromy - barlen*Math.cos(angle)/2);
    //line(context, tox - barlen*Math.sin(angle)/2, toy + barlen*Math.cos(angle)/2, tox + barlen*Math.sin(angle)/2, toy - barlen*Math.cos(angle)/2);
    context.stroke();
}

function gamma(u) {
    return 1 / Math.sqrt(1 - u ** 2);
}

function lorentzx(x, u, t) {
    return gamma(u) * (x - u * t);
}

function invlorentzx(x_p, u, t) {
    return x_p / gamma(u) + u * t;
}

function lorentzt(t, u, x) {
    return gamma(u) * (t - u * x / 1 ** 2)
}

function invlorentzt(t_p, u, x_p) {
    return gamma(u) * (t_p + u * x_p / 1 ** 2)
}