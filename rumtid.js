// constants
// todo: remove obsolete stuff
let diagramWidth = 700;
let diagramHeight = 700;
let origoX = diagramWidth / 2;
let origoY = diagramHeight / 2;
let unitSize = 75;
let u = 0.2;

let maxObjects = 4;

let colors = [
    //"#ffff00",
    "#0000ff",
    "#00ff00",
    "#ff0000",
]

let perspectiveWidth = 500;
let perspectiveHeight = 200;
let yBetweenObjects = 20;

// rest frame time
let t = 0;
let interval;

let tInput = document.getElementById("time")
tInput.value = t;

tInput.addEventListener('input', function () {
    t = parseFloat(tInput.value);
    draw_diagram();
    draw_perspective();
});

var playButton = document.getElementById(`playButton`);
var restartButton = document.getElementById(`restartButton`);
var playIcon = document.getElementById(`playIcon`);
var pauseIcon = document.getElementById(`pauseIcon`);
playButton.addEventListener('click', function () {
    interval = playTime(playButton, playIcon, pauseIcon, interval, tInput);
});

var restartButton = document.getElementById(`restartButton`);
restartButton.addEventListener('click', function () {
    interval = restartTime(playIcon, pauseIcon, tInput, interval);
});



// todo: still contants, remove obsolote
let Lp = 1;
let x_t0 = 0;

let defaultL = 1;
let defaultu = 0.5;
let defaultx_t0 = 0;


// refs
let objectsData = {};
let perspectives = {};

var addObjectBtn = document.getElementById("addObjectBtn");
var objectsContainer = document.getElementById("objectsContainer");
var perspectivesContainer = document.getElementById("perspectivesContainer");
var nextObjId = 1;

// when adding objects and handling their manipulation
addObjectBtn.addEventListener("click", function () {
    // HTML
    var objCol = colors.pop();
    var objectDiv = document.createElement("div");
    var objId = nextObjId++;
    objectDiv.classList.add("object");
    objectDiv.innerHTML = `
            <div id="objectnamerow">        
                <div class="circle" style="background-color: ${objCol};"></div>
                <label>${objId}</label>
            </div>
            <div class="prop-input">
                <label for="speed${objId}">Speed [c]</label>
                <div class="spd">
                    <input type="range" min="0" max="1" value="0" step="0.01" id="uSlider${objId}">
                    <input type="number" id="speed${objId}" name="speed${objId}" step="0.01" required>
                </div>
            </div>
            <div class="prop-input">
                <label for="length${objId}">Length [m]</label>
                <input type="number" id="length${objId}" name="length${objId}" required>
            </div>
            <div class="prop-input">
                <label for="x_t0${objId}">x at t = 0 [m]</label>
                <input type="number" id="x_t0${objId}" name="x_t0${objId}" required>
            </div>
            <div id="time-row">
                <label for="time">T_${objId} = </label>
                <input type="number" id="t${objId}" name="time" step="0.01" required>
                <div id="playback-ro">
                <button id="restartButton${objId}">
                    <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2l-4 4 4 4V2z" />
                    </svg>
                </button>
                <button id="playButton${objId}">
                    <svg id="playIcon${objId}" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8 5v14l11-7z" />
                    </svg>
                    <svg id="pauseIcon${objId}" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        style="display: none;">
                        <rect fill="currentColor" x="6" y="4" width="4" height="16" />
                        <rect fill="currentColor" x="14" y="4" width="4" height="16" />
                    </svg>
                </button>
            </div>
        </div>
        
            <div id="objectnamerow"><button id="remove${objId}" class="removeBtn">Remove</button></div>
        `;
    // todo: Is the contained used????
    objectsContainer.appendChild(objectDiv);

    // var perspectiveDiv = document.createElement("div");
    // perspectiveDiv.classList.add("perspective");
    // perspectiveDiv.innerHTML = `
    // <div class="circle" style="background-color: ${objCol};"></div>
    //         <h2>Object ${objId} frame</h2>
    //         <canvas id="perspective${objId}"></canvas>
    //         <div id="timestuff">
    //     <div id="time-row">
    //         <label for="time">T_${objId} = </label>
    //         <input type="number" id="t${objId}" name="time" step="0.01" required>
    //     </div>
    //     <div id="playback-row">
    //         <button id="restartButton${objId}">
    //             <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    //                 <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10h-2a8 8 0 1 1-8-8V2l-4 4 4 4V2z" />
    //             </svg>
    //         </button>
    //         <button id="playButton${objId}">
    //             <svg id="playIcon${objId}" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    //                 <path fill="currentColor" d="M8 5v14l11-7z" />
    //             </svg>
    //             <svg id="pauseIcon${objId}" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    //                 style="display: none;">
    //                 <rect fill="currentColor" x="6" y="4" width="4" height="16" />
    //                 <rect fill="currentColor" x="14" y="4" width="4" height="16" />
    //             </svg>
    //         </button>
    //     </div>
    // </div>
    //     `;
    // perspectivesContainer.appendChild(perspectiveDiv);
    // perspectives[objId] = perspectiveDiv;

    var speedInput = document.getElementById(`speed${objId}`);
    speedInput.value = defaultu;
    var speedSlider = document.getElementById(`uSlider${objId}`);
    speedSlider.value = defaultu;
    speedSlider.rang
    var lengthInput = document.getElementById(`length${objId}`);
    lengthInput.value = defaultL;
    var x_t0Input = document.getElementById(`x_t0${objId}`);
    x_t0Input.value = defaultx_t0;
    var t_Input = document.getElementById(`t${objId}`);
    t_Input.value = 0;

    speedInput.addEventListener('input', function () {
        setObjectsData(objId);
        speedSlider.value = speedInput.value;
    });

    speedSlider.addEventListener('input', function () {
        speedInput.value = speedSlider.value;
        setObjectsData(objId);
    });

    lengthInput.addEventListener('input', function () {
        setObjectsData(objId);
    });

    x_t0Input.addEventListener('input', function () {
        setObjectsData(objId);
    });

    t_Input.addEventListener('input', function () {
        setObjectsData(objId);
    });


    objectsData[objId] = {
        speed: parseFloat(speedInput.value),
        length: parseFloat(lengthInput.value),
        x_t0: parseFloat(x_t0Input.value),
        color: objCol,
        t: parseFloat(t_Input.value),
        t_interval: undefined,
    };

    var playButton = document.getElementById(`playButton${objId}`);
    var playIcon = document.getElementById(`playIcon${objId}`);
    var pauseIcon = document.getElementById(`pauseIcon${objId}`);
    var interval = objectsData[objId].t_interval;
    playButton.addEventListener('click', function () {
        objectsData[objId].t_interval = playTime(playButton, playIcon, pauseIcon, objectsData[objId].t_interval, t_Input, objId);
    });
    var restartButton = document.getElementById(`restartButton${objId}`);
    restartButton.addEventListener('click', function () {
        objectsData[objId].t_interval = restartTime(playIcon, pauseIcon, t_Input, objectsData[objId].t_interval, objId);
    });


    function setObjectsData(id) {
        objectsData[id].speed = parseFloat(speedInput.value);
        objectsData[id].length = parseFloat(lengthInput.value);
        objectsData[id].x_t0 = parseFloat(x_t0Input.value);
        objectsData[id].t = parseFloat(t_Input.value);
        objectsData[id].t_interval;
        draw_diagram();
        draw_perspective();
    }

    // function playTime(id) {
    //     const playIcon = document.getElementById(`playIcon${objId}`);
    //     const pauseIcon = document.getElementById(`pauseIcon${objId}`);
    //     var interval = objectsData[id].t_interval;

    //     if (playIcon.style.display === 'none') {
    //         playIcon.style.display = 'block';
    //         pauseIcon.style.display = 'none';
    //         // Optionally, change the button's aria-label to "Play"
    //         document.getElementById(`playButton${objId}`).setAttribute('aria-label', 'Play');
    //         if (interval) {
    //             clearInterval(interval);
    //         }
    //     } else {
    //         playIcon.style.display = 'none';
    //         pauseIcon.style.display = 'block';
    //         // Optionally, change the button's aria-label to "Pause"
    //         document.getElementById(`playButton${objId}`).setAttribute('aria-label', 'Pause');
    //         interval = setInterval(() => {
    //             objectsData[id].t += 0.005;
    //             document.getElementById(`t${objId}`).value = t.toFixed(2);

    //             draw_diagram();
    //             draw_perspective();
    //         },
    //             1);
    //     }
    // }

    var removeBtn = document.getElementById(`remove${objId}`);
    removeBtn.addEventListener('click', function () {
        colors.push(objectsData[objId].color);
        delete objectsData[objId];
        addObjectBtn.style.visibility = 'visible';
        removeBtn.parentNode.parentNode.remove();
        //perspectives[objId].remove();
        draw_diagram();
        draw_perspective();
    });

    // can only add so many that we have colors for
    if (colors.length <= 0) {
        addObjectBtn.style.visibility = 'hidden';
    }

    // lastly we draw it all
    draw_diagram();
    draw_perspective();
});


function playTime(playButton, playIcon, pauseIcon, interval, t_Input, objId = -1) {
    if (playIcon.style.display === 'none') {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        // Optionally, change the button's aria-label to "Play"
        playButton.setAttribute('aria-label', 'Play');
        if (interval) {
            clearInterval(interval);
        }
    } else {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        // Optionally, change the button's aria-label to "Pause"
        playButton.setAttribute('aria-label', 'Pause');
        interval = setInterval(() => {
            if (objId == -1) {
                t += 0.005;
                t_Input.value = t.toFixed(2);
            }
            else {
                objectsData[objId].t += 0.005;
                t_Input.value = objectsData[objId].t.toFixed(2);
            }

            draw_diagram();
            draw_perspective();
        },
            10);
    }
    return interval;
}

function restartTime(playIcon, pauseIcon, t_Input, interval, objId = -1) {
    if (interval) {
        clearInterval(interval);
    }

    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';

    if (objId == -1) {
        t = 0;
    }
    else {
        objectsData[objId].t = 0;
    }
    t_Input.value = 0.00;
    draw_diagram();
    draw_perspective();
    return interval;
}




// the start function
window.onload = function () {
    draw_diagram();
    draw_perspective();
}

// small perspectives
function draw_perspective() {
    return;
    let canvas = document.getElementById("perspectiverest");
    canvas.width = perspectiveWidth;
    canvas.height = perspectiveHeight;
    let context = canvas.getContext("2d");
    context.font = "18px serif";
    let axis_y = perspectiveHeight - 25;
    arrow(context, 0, axis_y, perspectiveWidth, axis_y);
    length_marker(context, perspectiveWidth / 2, axis_y, 1, 0, 10);
    context.fillText("0", perspectiveWidth / 2 - 4, axis_y + 20);

    let i = 1;
    for (let key in objectsData) {
        var obj = objectsData[key];
        var u = obj.speed;
        var L = obj.length / gamma(u);
        var x_t = obj.x_t0;
        var col_0 = context.fillStyle;
        context.strokeStyle = obj.color;
        measure(context, perspectiveWidth / 2 + unitSize * (u * t + x_t), axis_y - 25 * i, perspectiveWidth / 2 + unitSize * (L + x_t + u * t), axis_y - 25 * i, "m");
        context.strokeStyle = col_0;
        i++;
    }

    // draw_fill(con, [0, per.width, per.width, 0], [0, 0, per.height, per.height]);

    for (let key in objectsData) {
        let canvas = document.getElementById("perspective" + key);
        canvas.width = perspectiveWidth;
        canvas.height = perspectiveHeight;
        let context = canvas.getContext("2d");
        context.font = "18px serif";
        let axis_y = perspectiveHeight - 25;
        arrow(context, 0, axis_y, perspectiveWidth, axis_y);
        length_marker(context, perspectiveWidth / 2, axis_y, 1, 0, 10);
        context.fillText("0", perspectiveWidth / 2 - 4, axis_y + 20);

        let i = 1;
        var frame_speed = objectsData[key].speed;
        var frame_gamma = gamma(frame_speed);
        for (let key in objectsData) {
            var obj = objectsData[key];
            var u = obj.speed;
            var L = obj.length / gamma(u);
            var x_t = obj.x_t0;
            var time = obj.t;
            var bottom = u * time + x_t;
            var top = L + x_t + u * time;
            var u_p = (u - frame_speed) / (1 - u * frame_speed)
            var frame_bottom = frame_gamma * (-frame_speed * time);
            var frame_top = frame_gamma * (L - frame_speed * time);

            var col_0 = context.fillStyle;
            context.strokeStyle = obj.color;
            measure(context,
                perspectiveWidth / 2 + unitSize * (frame_bottom),
                axis_y - 25 * i,
                perspectiveWidth / 2 + unitSize * (frame_top),
                axis_y - 25 * i,
                "m");
            context.strokeStyle = col_0;
            i++;
        }

        // draw_fill(con, [0, per.width, per.width, 0], [0, 0, per.height, per.height]);
    }
}


// wheres this from lol
function on_scroll() {
    console.log("scrolling");
}


// main diagram
function draw_diagram() {
    let diagram = document.getElementById("diagram");
    diagram.width = diagramWidth;
    diagram.height = diagramHeight;
    let context = diagram.getContext("2d");
    context.font = "18px serif"

    var col_0 = context.strokeStyle;
    context.strokeStyle = "#eeeeee";
    var hlines = Math.floor(diagramHeight / unitSize);
    for (let i = 1; i < hlines; i++) {
        line(context,
            0,
            i * unitSize,
            diagramWidth,
            i * unitSize,
            1);
    }
    var vlines = Math.floor(diagramWidth / unitSize);
    for (let i = 1; i < vlines; i++) {
        line(context,
            i * unitSize,
            0,
            i * unitSize,
            diagramHeight,
            1);
    }
    context.strokeStyle = col_0;

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

    // HEREEEEE
    var x_0 = gamma(u) * (x_p_0 + u * t)
    var x_1 = gamma(u) * (x_p_1 + u * t)
    var t_0 = gamma(u) * (t + u * x_p_0)
    var t_1 = gamma(u) * (t + u * x_p_1)

    for (let key in objectsData) {
        var obj = objectsData[key];
        var u = obj.speed;
        var L = obj.length / gamma(u);
        var x_t = obj.x_t0;
        var t_p = obj.t;
        var col = obj.color;
        var col_0 = context.strokeStyle;

        context.strokeStyle = col;
        console.log(t_p);
        line(context,
            origoX - diagramWidth + x_t * unitSize,
            origoY + u * diagramHeight - t_p / gamma(u) * unitSize,
            origoX + diagramWidth + x_t * unitSize,
            origoY - u * diagramHeight - t_p / gamma(u) * unitSize,
            1
        )
        line(context,
            origoX - diagramWidth / 2 * u + x_t * unitSize,
            origoY + diagramHeight / 2,
            origoX + diagramWidth / 2 * u + x_t * unitSize,
            origoY - diagramHeight / 2,
            1
        )
        context.strokeStyle = col_0;

        fill(context,
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
            ],
            col
        );
        circle(context,
            origoX + (x_t + gamma(u) * (u * t_p)) * unitSize,
            origoY - (u * (gamma(u) * u * t_p) + t_p / gamma(u)) * unitSize,
            10, col);
        circle(context,
            origoX + (x_t + L * gamma(u) * gamma(u) + gamma(u) * (u * t_p)) * unitSize,
            origoY - (u * (L * gamma(u) * gamma(u) + gamma(u) * u * t_p) + t_p / gamma(u)) * unitSize,
            10, col);


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

    // S' HERE
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
    // console.log(t);
    line(context, -diagramWidth, origoY - t * unitSize, diagramWidth, origoY - t * unitSize);



    //print("hello")
    // measure( context, origoX, origoY, origoX + Lp / Math.sqrt(u**2 + 1) * unitSize / gamma(u), origoY - Lp * u / Math.sqrt(u**2 + 1) * unitSize/gamma(u), "L' = " + Math.round(1 / gamma(u) * 1000)/1000 + "L");

}


// drawing functions

function line(context, fromx, fromy, tox, toy, line_width = 1) {
    context.beginPath();
    context.lineWidth = line_width;
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.stroke();
}

function circle(context, x, y, radius, color) {
    var col_0 = context.strokeStyle;
    context.strokeStyle = color;
    context.beginPath();
    context.color
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.stroke();
    context.strokeStyle = col_0;
}

function fill(context, xs, ys, color) {
    var col_0 = context.fillStyle;
    context.fillStyle = color;
    context.globalAlpha = 0.2;
    context.moveTo(xs[0], ys[0]);
    context.beginPath();

    for (let i = 0; i < xs.length; i++) {
        context.lineTo(xs[i], ys[i]);
    }
    //context.lineTo(xs[0], ys[0]);
    context.closePath();
    context.fill();
    context.fillStyle = col_0;
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
    return gamma(u) * (t - u * x / 1 ** 2);
}

function invlorentzt(t_p, u, x_p) {
    return gamma(u) * (t_p + u * x_p / 1 ** 2);
}