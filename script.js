$(document).ready(function () {
    //document.getElementById("ShadowPane_Default").style.display = "none";
    //document.getElementById("fidlockToggle").checked = "1";
    //document.getElementById("heatsinkColorToggle").checked = "1"; 
            //Prevent linebreak in title
        document.getElementById('title').addEventListener('keydown', (evt) => {
            if (evt.keyCode === 13) {
                evt.preventDefault();
            }
        });
    
});

//Add ColorPaneClick-Events
window.onload = function () {

    //Set inital config
    let buildname = "The PewPew Coloring Book";

    //let here = new URL(window.location.href);
    //here.searchParams.set('Name', buildname);
    window.history.replaceState(null, null, '?buildname=' + buildname);


    let colors = []; //Color - Colorname
    colors.push(["#40403C", "eSun - Black"]);
    colors.push(["#FFA534", "ecoPLA - Neon Orange"]);
    colors.push(["#A8F3FF", "eSun - Light Blue"]);
    colors.push(["#FFFFFF", ""]);
    colors.push(["#FFFFFF", ""]);

    let parts = []; //Color - Partname
    parts.push([0, "Base_ColorPane"]);
    parts.push([0, "Bottom_ColorPane"]);
    parts.push([0, "ScrewCover_ColorPane"]);
    parts.push([0, "Grip_ColorPane"]);
    parts.push([0, "TriggerGuard_ColorPane"]);
    parts.push([0, "Joystick_ColorPane"]);

    parts.push([1, "Upper_ColorPane"]);
    parts.push([1, "Trigger_ColorPane"]);
    parts.push([1, "MagRelease_ColorPane"]);
    parts.push([1, "BatteryDoorKnob_ColorPane"]);

    parts.push([2, "Fidlock_ColorPane"]);
    parts.push([2, "BatteryDoor_ColorPane"]);
    parts.push([2, "Middle_ColorPane"]);


    let extras = [];
    extras.push(1); //fidlock
    extras.push(1); //heatsink
    extras.push(1); //HOLO

    //Load config
    document.getElementById("title").Text = buildname;

    for (var i = 0; i < colors.length; i++) {
        var color = colors[i][0];
        var text = colors[i][1];

        var swatch = document.getElementById(i);
        swatch.value = color;
        document.getElementById(swatch.id + "txt").value = text;

        for (var y = 0; y < parts.length; y++) {
            if (parts[y][0] == i) {
                var colorPane = document.getElementById(parts[y][1]);
                colorPane.style.fill = swatch.value;
                colorPane.setAttribute("coloredBy", "");
                colorPane.style.coloredBy = swatch;
            }
        }
    }

    if (extras[0] == 1) //fidlock
    {
        console.log("Fidlock active!");
        document.getElementById("ShadowPane_Default").style.display = "none";
        document.getElementById("fidlockToggle").checked = "1";
    }
    if (extras[1] == 1) //heatsink
    {
        document.getElementById("heatsinkColorToggle").checked = "1";
    }

    if (extras[2] == 1) {
        document.getElementById("holoToggle").checked = "1";
    }


    //Set onclick functions to colorpanes
    var colorPanes = document.getElementsByClassName('ColorPane');
    for (var i = 0; i < colorPanes.length; i++) {
        var colorPane = colorPanes[i];
        /*console.log(colorPane.id);*/
        /*colorPane.addEventListener("click", colorPaneClicked(colorPane));*/
        colorPane.onclick = function () {
            colorPaneClicked(this);
        }
        //colorPane.setAttribute("coloredBy", "");
    }

    //Set onclick functions to swatches
    var colorSwatches = document.getElementsByClassName('col');
    for (var i = 0; i < colorSwatches.length; i++) {
        var colorSwatch = colorSwatches[i];
        //console.log(colorSwatch.id);
        colorSwatch.onclick = function () {
            swatchClicked(this);
        }

        colorSwatch.oninput = function () { //Also register to oninput
            swatchClicked(this);
        }
    }
    //Prefill bucket and fillcolor with first color
    //fillColor = document.getElementsByClassName('col')[0].value;
    //document.getElementById("Paintbucket").style.fill = fillColor;
    selectedCol = document.getElementsByClassName('col')[0];
    document.getElementById("Paintbucket").style.fill = selectedCol.value;
}

let selectedCol; //Currently selected color
function colorPaneClicked(element) {
    if (element.id == "Heatsink_ColorPane") {
        console.log("Heatsink can not be colored!");
        return;
    }
    console.log(element.id + " clicked! Coloring it in " + selectedCol.value);
    element.style.coloredBy = selectedCol;
    element.style.fill = selectedCol.value;
    //console.log(element.style.coloredBy);
}

function swatchClicked(element) {
    console.log("Color " + element.id + " clicked!");
    //console.log("Fillcolor " + element.value + " selected!");
    selectedCol = element;
    document.getElementById("Paintbucket").style.fill = element.value; //Fill paintbucket

    var colorPanes = document.getElementsByClassName('ColorPane'); //Recolor every part that is colored by this color
    for (var i = 0; i < colorPanes.length; i++) {
        var colorPane = colorPanes[i];
        if (colorPane.style.coloredBy == element) {
            colorPane.style.fill = element.value;
        }
    }
}

function toggleFidlock(element) {
    console.log("Fidlock toggled!");
    if (element.checked) //FIDLOCK ON
    {
        var divsToUnHide = document.getElementsByClassName("Fidlock");
        for (var i = 0; i < divsToUnHide.length; i++) {
            divsToUnHide[i].style.display = ""; // depending on what you're doing
        }
        //Activate fidlock shadow and deactivate default shadow
        document.getElementById("ShadowPane_Default").style.display = "none";
        document.getElementById("ShadowPane_Fidlock").style.display = "unset";
    } else //FIDLOCK OFF
    {
        var divsToHide = document.getElementsByClassName("Fidlock");
        for (var i = 0; i < divsToHide.length; i++) {
            divsToHide[i].style.display = "none"; // depending on what you're doing
        }
        //Deactivate fidlock shadow and deactivate default shadow
        document.getElementById("ShadowPane_Fidlock").style.display = "none";
        document.getElementById("ShadowPane_Default").style.display = "unset";
    }
}

function heatsinkColorToggle(element) {
    console.log("Heatsink toggled!");
    if (element.checked) //CageOrange
    {
        document.getElementById("Heatsink_ColorPane").style.fill = "#FFA534";
    } else //CageBlack
    {
        document.getElementById("Heatsink_ColorPane").style.fill = "#1D1D1B";
    }
}


let maxChars = 20;
let currentChars = 0;
let once = true;

function checkLength(event) {
    if (currentChars >= maxChars) {
        event.preventDefault();
    } else {
        currentChars++;
    }
}
