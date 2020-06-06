var listDict = {};

function generateID (name) {
    // Strings to hold the final ID and original name
    var ID = "";
    var origName = name;

    // Sanitize the string
    {
    name = name.replace("(", "").replace(")", "");
    name = name.toLowerCase();
    name = name.replace("ñ", "n");
    name = name.replace("á", "a");
    name = name.replace("é", "e");
    name = name.replace("í", "i");
    name = name.replace("ó", "o");
    name = name.replace("ú", "u");
    name = name.replace("ú", "u");
    name = name.replace("ç", "c");
    }

    // Remove spaces
    nameSplit = name.split(" ");

    for (let i = 0; i < nameSplit.length; i++) {
        ID += nameSplit[i];
    }

    // Add to "dictionary"
    //listID[listID.length] = ID;
    //listName[listID.length - 1] = origName;
    listDict[ID] = origName;

    return ID;
}

function addSeparator (value) {
    var c = 0;
    var sepValue = "";

    for (let i = value.length - 1; i >= 0; i--) {
        if (c == 3) {
            sepValue = "," + sepValue;
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
    input.id = generateID(lineElements[0]);
    input.classList.add("cantidad");
    input.classList.add("large");
    input.min = "0";
    if (lineElements[1] == "Kg") input.step = "0.1";
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

function getCSV () {
    return new Promise(
        function (resolve, reject) {
            const request = new XMLHttpRequest();
            request.onload = function () {
                if (this.status === 200) {
                    // Request succeeded
                    resolve(this.response);
                }
                else {
                    // There is a problem
                    reject(new Error(this.statusText));
                }
            };
            request.onerror = function () {
                reject( new Error(
                    'XMLHttpRequest Error: ' + this.statusText ));
            };
            request.open('GET', 'listado.csv');
            request.send();
        });
}

function mobileCheck () {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

function strUsed (testStr) {
    if (testStr != 0 && testStr != undefined && testStr != null && testStr != "")
        return true;
    return false;
}

function confirmData () {
    // Get the current day
    var d = new Date();

    // Assign the current date to the mail subject
    var subject = "Pedido del ".concat(d.getDate(), " de ", d.getMonth(), " de ", d.getFullYear());
    
    // Determine line break sequence
    // It should be %0D%0A if on Linux (PC?)
    // It should be <br> if on Android (Mobile?)
    var nlseq = "";

    if (!mobileCheck()) nlseq = "%0D%0A"; // Not mobile
    else nlseq = "<br>";                  // Mobile

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
            tempList = tempList.concat("- ", document.getElementById(keys[i]).value, " ", listDict[keys[i]], nlseq);
            nitems++;
        }
    }

    // If nothing was ordered...
    if (nitems == 0) {
        // TODO Do we want to return? Or should we allow empty orders?
        alert("La lista esta vacia! (buscar alternativa sin tildes)");
    }
    else {
        // Opening
        body = body.concat("Encargo de:" + nlseq);
        body = body.concat(tempList);
    }

    // Include additional comments
    if (strUsed(document.getElementById("text-comentarios").value)) {
        body = body.concat(nlseq + "Comentarios:" + nlseq);
        body = body.concat(document.getElementById("text-comentarios").value, nlseq);
    }

    // Include contact info
    body = body.concat(nlseq + "Contacto:" + nlseq);
    body = body.concat(document.getElementById("nombre").value, nlseq);
    body = body.concat(document.getElementById("telefono").value, nlseq);
    body = body.concat(document.getElementById("direccion").value, nlseq);
    var hrefString = "mailto:famellad@gmail.com?subject=".concat(subject, "&body=", body);
    window.location.href = hrefString;
}