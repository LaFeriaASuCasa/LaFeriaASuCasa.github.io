var listDict = {};
var monthList = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function generateID (lineElements) {
    // Extract useful elements
    var name = lineElements[0];
    var unit = lineElements[1];

    // Strings to hold the final ID and original name
    var ID = "";
    var origName = name;

    // Sanitize the string
    name = sanitizeString(name).replace("(", "").replace(")", "").replace(".", "");

    // Remove spaces
    // TODO why can't we use replace() here?
    nameSplit = name.split(" ");

    for (let i = 0; i < nameSplit.length; i++) {
        ID += nameSplit[i];
    }

    // Add to "dictionary"
    listDict[ID] = [origName, unit];

    return ID;
}

function addSeparator (value) {
    var c = 0;
    var sepValue = "";

    for (let i = value.length - 1; i >= 0; i--) {
        if (c == 3) {
            sepValue = "." + sepValue;
            c = 0;
        }
        else c++;

        sepValue = value[i] + sepValue;
    }

    return sepValue;
}

function parsePricing (row, lineElements) {
    // Create new cell to hold data
    var cell = row.insertCell(-1);

    cell.className = "price-cell";

    // Write price per unit
    cell.textContent = "$" + addSeparator(lineElements[2]) + " / " + lineElements[1];
}

function selectorCell (row, lineElements) {
    // Create new cell to hold data
    var cell = row.insertCell(-1);
    // Create new input element as the selector
    var input = document.createElement("input");
    // Create a span element to hold the unit
    var span = document.createElement("span");

    cell.className = "sel-cell";
    span.className = "unit";

    // Set selector as number and initialize at 0
    input.type = "number";
    input.placeholder = 0;
    input.id = generateID(lineElements);
    input.classList.add("cantidad");
    input.classList.add("large");
    input.min = "0";
    if (lineElements[1] == "kg" || lineElements[1] == "Kg") input.step = "0.01";
    else input.step = "1";

    // Write unit to span
    span.textContent = lineElements[1];

    // Append elements to cell
    cell.appendChild(input);
    cell.appendChild(span);
}

function generateTable (csvLines) {
    // Define where to put the table
    var tl = document.getElementById("tab");

    // Create the table object
    var table = document.createElement("table");
    //table.border = 1;
    table.className = "table";
    table.id = "tabla-verduras";
    // TODO define id and other attributes

    // Iterate over csv lines
    for (let i = 0; i < csvLines.length; i++) {
        // If it's an empty line, ignore and go on
        if (csvLines[i] == "") continue;

        // If the line is a comment, ignore and go on
        if (csvLines[i][0] == ";") continue;

        // Generate a new row object
        var row = table.insertRow(-1);
        
        // Parse the csv line
        lineElements = csvLines[i].split(',');

        // Handle the header the header
        if (lineElements[0][0] == '#') {
            // Create a cell for the header
            var cell = row.insertCell(-1);

            cell.className = "header";

            // Merge cells
            cell.colSpan = 3;
            // Write cell
            cell.textContent = lineElements[0].split("#")[1];
        }
        // Handle everything else
        else {
            // Write name of product
            var nameCell = row.insertCell(-1);
            nameCell.className = "name-cell";

            nameCell.textContent = lineElements[0];

            // Handle the pricing column
            parsePricing(row, lineElements);

            // Handle the selection column
            selectorCell(row, lineElements);
        }
    }

    // Finally add the table to the document
    tl.appendChild(table);
}

function strUsed (testStr) {
    if (testStr != 0 && testStr != undefined && testStr != null && testStr != "")
        return true;
    return false;
}

function confirmData (method) {
    // Get the current day
    var d = new Date();

    // Assign the current date to the mail subject
    var subject = "Pedido de ".concat(document.getElementById("nombre").value, 
                   " (", d.getDate(), " de ", monthList[d.getMonth()], " de ", d.getFullYear(), ")");
    
    // Determine line break sequence
    // It should be %0D%0A if on Linux (PC?)
    // It should be <br> if on Android (Mobile?)
    var nlseq = "";

    if (method == "email") {
        if (!mobileCheck()) nlseq = "%0D%0A"; // Not mobile
        else nlseq = "<br>";                  // Mobile
    }
    else {
        nlseq = "%0D%0A";
    }


    // Init empty variable to hold the body
    var body = "";
    var tempList = "";

    // List itself, iterates over ids
    keys = Object.keys(listDict);

    var nitems = 0; // Number of items

    for (let i = 0; i < keys.length; i++) {
        // Check wheter there is a value
        //console.log(document.getElementById(keys[i]).value);
        if (strUsed(document.getElementById(keys[i]).value)) {
            var un = listDict[keys[i]][1];

            // If it's measured in units, ignore, else, add the unit to the message
            if (un == "U" || un == "u") tempList = tempList.concat("- ", document.getElementById(keys[i]).value, " ")
            else tempList = tempList.concat("- ", document.getElementById(keys[i]).value, " ", listDict[keys[i]][1], " de "); 

            tempList = tempList.concat(listDict[keys[i]][0], nlseq);
            nitems++;
        }
    }

    // If nothing was ordered...
    if (nitems == 0) {
        // TODO Do we want to return? Or should we allow empty orders?
        alert("¡No hay productos seleccionados!");
    }
    else {
        // Opening
        body = body.concat("Pedido de:" + nlseq);
        body = body.concat(tempList);
    }

    // Include additional comments
    if (strUsed(document.getElementById("text-comentarios").value)) {
        body = body.concat(nlseq + "Comentarios:" + nlseq);
        body = body.concat(document.getElementById("text-comentarios").value.replace("\n", nlseq), nlseq);
    }

    // Include contact info
    body = body.concat(nlseq + "Contacto:" + nlseq);
    body = body.concat(document.getElementById("nombre").value, nlseq);
    body = body.concat(document.getElementById("telefono").value, nlseq);
    body = body.concat(document.getElementById("direccion").value, nlseq);

    if (method == "email") sendEmail(subject, body);
    else sendWhatsapp(body);
}

function sendEmail (subject, body) {
    var hrefString = "mailto:suferiaalacasa@gmail.com?subject=".concat(subject, "&body=", body);
    window.location.href = hrefString;
}

function sendWhatsapp (text) {
    text = text.replace(" ", "%20");

    var hrefString = "whatsapp://send?phone=+56984597639&text=".concat(text);
    window.location.href = hrefString;
}