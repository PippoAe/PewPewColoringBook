$(document).ready(function () {
    //document.getElementById("ShadowPane_Default").style.display = "none";
    //document.getElementById("fidlockToggle").checked = "1";
    //document.getElementById("heatsinkToggle").checked = "1"; 
    //Prevent linebreak in title
    document.getElementById('title').addEventListener('keydown', (evt) => {
        if (evt.keyCode === 13) {
            evt.preventDefault();
        }
    });

});

//Add ColorPaneClick-Events
window.onload = function () {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var urlBuild = urlParams.get('Build');
    var urlConfig = urlParams.get('Config');

    if (urlBuild && urlConfig) {
        console.log("Trying to load build from URL!");
        try {
            var configDeserialized = JSON.parse(atob(urlConfig));
            //console.log(configDeserialized);
            loadConfig(urlBuild, configDeserialized);
        } catch (err) {
            console.log("Error while loading build from URL!");
            console.log(err);
            loadDefaults();
        }
        console.log("Build '" + urlBuild + "' loaded!")
        window.history.pushState({}, document.title, "");

    } else {
        loadDefaults();
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

function loadDefaults() {
    //Set inital config
    var buildname = "The PewPew Coloring Book";

    var colors = []; //Color - Colorname
    colors.push(["#40403C", "eSun - Black"]);
    colors.push(["#FFA534", "ecoPLA - Neon Orange"]);
    colors.push(["#A8F3FF", "eSun - Light Blue"]);
    colors.push(["#FFFFFF", ""]);
    colors.push(["#FFFFFF", ""]);

    var parts = []; //Color - Partname
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


    var extras = [];
    extras.push(1); //fidlock
    extras.push(1); //heatsink
    extras.push(1); //HOLO
    extras.push(0); //Leftie

    var config = [];
    config.push(colors, parts, extras);

    loadConfig(buildname, config);
}

function loadConfig(buildname, config) {
    var colors = config[0];
    var parts = config[1];
    var extras = config[2];

    //Load config
    document.getElementById("title").textContent = buildname;

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


    /*document.getElementById("ShadowPane_Default").style.display = "none";*/
    document.getElementById("fidlockToggle").checked = extras[0];
    toggleFidlock(document.getElementById("fidlockToggle"));

    document.getElementById("heatsinkToggle").checked = extras[1];
    toggleHeatsink(document.getElementById("heatsinkToggle"));

    document.getElementById("holoToggle").checked = extras[2];
    toggleHOLO(document.getElementById("holoToggle"));

    document.getElementById("leftieToggle").checked = extras[3];
    toggleLeftie(document.getElementById("leftieToggle"));
}


let lasttext = "";
let lastColor = "";

function saveurltoclipboard(element) {
    if (element.innerHTML == 'Copied to clipboard!') {
        return
    }

//    if (document.getElementById("title").textContent == "The PewPew Coloring Book") {
//        document.getElementById("title").textContent = prompt("Give your build a name:", document.getElementById("title").textContent);
//        document.getElementById("title").style.outline = "2px solid grey"
//        setTimeout(function () {
//                document.getElementById("title").style.outline = "0px solid transparent"
//        }.bind(this), 1000);
//
    //    return;
    //}


    console.log("Preparing configuration!")
    url = getConfigURL();
    console.log(url);

    let success = "false";
    navigator.clipboard
        .writeText(url)
        .then(() => {
            success = "true";
        })
        .catch(() => {
            alert("Something went wrong!");
        });

    if (success) {
        var last = element.innerHTML;
        var lastColor = element.style.backgroundColor;

        element.innerHTML = 'Copied to clipboard!';
        element.style.backgroundColor = "lightGreen";
        setTimeout(function () {
            element.innerHTML = last;
            element.style.backgroundColor = lastColor;
        }.bind(this), 2000);
    }
}

function getConfigURL() {
    var buildname = document.getElementById("title").textContent;

    //Get all colors
    var colors = [];
    var swatches = document.getElementsByClassName("col");
    for (var i = 0; i < swatches.length; i++) {
        var swatch = swatches[i];
        var swatchtext = document.getElementById(swatch.id + "txt");
        colors[i] = [swatch.value, swatchtext.value];
    }

    var parts = [];
    var colorPanes = document.getElementsByClassName("ColorPane");
    for (var i = 0; i < colorPanes.length; i++) {
        var colorPane = colorPanes[i];
        /*console.log(colorPane.id);*/
        if (colorPane.id == "Heatsink_ColorPane") {
            continue;
        }
        parts[i] = [colorPane.style.coloredBy.id, colorPane.id];
    }

    var extras = [];
    if (document.getElementById("fidlockToggle").checked) {
        extras[0] = 1;
    }
    if (document.getElementById("heatsinkToggle").checked) {
        extras[1] = 1;
    }
    if (document.getElementById("holoToggle").checked) {
        extras[2] = 1;
    }
    if (document.getElementById("leftieToggle").checked) {
        extras[3] = 1;
    }

    let config = [];
    config.push(colors, parts, extras);
    var configJSONString = JSON.stringify(config);
    //console.log(JSON.stringify(config));

    var base64 = btoa(configJSONString);
    //var configDeserialized = JSON.parse(atob(base64));

    //console.log(base64);
    //console.log(configDeserialized);

    let here = new URL(window.location.href);
    here.searchParams.set('Build', buildname);
    here.searchParams.set('Config', base64);
    return here.href;
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

function toggleHeatsink(element) {
    console.log("Heatsink toggled!");
    if (element.checked) //CageOrange
    {
        document.getElementById("Heatsink_ColorPane").style.fill = "#FFA534";
    } else //CageBlack
    {
        document.getElementById("Heatsink_ColorPane").style.fill = "#1D1D1B";
    }
}

function toggleHOLO(element) {

}

function toggleLeftie(element) {
    console.log("Leftie toggled!");
    if (element.checked) //Leftie active
    {
        document.getElementById("PewPewSVG").setAttribute("transform", "scale (-1, 1)");
        document.getElementById("PewPewSVG").setAttribute("transform-origin", "center");


        /*document.getElementById("Middle_Contours_PewPew").setAttribute("transform", "scale (-1, 1)");*/
        /*document.getElementById("Middle_Contours_PewPew").setAttribute("transform-origin", "center");*/
        /*document.getElementById("Middle_Contours_PewPew").setAttribute("translate", "(-1000, 0)");*/

        document.getElementById("wrapper").style.right = "0";
    } else {
        document.getElementById("PewPewSVG").setAttribute("transform", "");
        document.getElementById("PewPewSVG").setAttribute("transform-origin", "");

        document.getElementById("wrapper").style.right = "";
    }
}



let maxChars = 20;
let currentChars = 0;
let once = true;

function checkLength(event) {
    console.log(currentChars);
    console.log(maxChars);
    if (currentChars >= maxChars) {
        event.preventDefault();
    } else {
        currentChars++;
    }
}
