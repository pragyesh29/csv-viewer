// Global variable to store count of number of attributes (columns) the table will have.
let globalHeadFileds = [];

function handleFiles(files) {
    // Creating instance of FileReader to be able to read file selected by user
    var reader = new FileReader();
    // To read text or blob file 
    reader.readAsText(files[0]);
    // After file will be read completely the onload event handler will handle the event successfully
    reader.onload = loadHandler;
    // In case of any error this error event listner will handle the event
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    let rawData = event.target.result;
    processData(rawData);
}

function errorHandler(event) {
    if (event.target.error.name == 'NotReadableError') {
        alert('Cannot read File!');
    }
}

function processData(rawData) {
    let getBtnContent = document.getElementById('addClearButton');
    getBtnContent.style.display = 'block';

    // Regular expression to split whereever new line is encountered
    let allTextLines = rawData.split(/\n/);
    let lines = [];
    while (allTextLines.length) {
        let oneRow = allTextLines.shift();
        lines.push(oneRow.split(','));
    }

    // initializing global variable to store number of attributes of one row in table.
    lines[0].forEach(element => {
        globalHeadFileds.push(element)
    });

    // Rendering data by creating table element
    document.getElementById('output').innerHTML = '';
    let table = document.createElement('table');
    table.classList.add('table');
    let tableHeader = lines[0];
    // Creating header of the table and since header is the top so we used 0 in insertRow function
    let headRow = table.createTHead().insertRow(0);
    headRow.classList.add('headRow');
    for (let i = 0; i < tableHeader.length; i++) {
        let x = headRow.insertCell(i);
        x.innerHTML = tableHeader[i];
    }
    // shift() function returns the first element of the array, here array is modified itself and first element is removed.
    lines.shift();
    for (let i = 0; i < lines.length; i++) {
        // -1 inserts row at last of the table
        // 0 will insert row as the first row
        let row = table.insertRow(-1);
        for (let j = 0; j < lines[0].length; j++) {
            // insertCell(<number>) creates a cell in selected row
            let x = row.insertCell(j);
            x.innerHTML = lines[i][j];
        }
    }
    document.getElementById('output').appendChild(table);
}

function closeDynamicFormContent() {
    const element = document.getElementById('addRowForm');
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
}

// Clear the presented data
function clearFunc() {
    closeDynamicFormContent();
    location.reload();
}

// Open the form
function addNewDataRow() {
    // Creating form with dynamic nature
    // Following is the one view which will be stacked according to the data in the file of .csv type
    // <div>
    //      <input type="text" class="input" name=<dynamic> placeholder=<dynamic>/>
    // </div>

    const form = document.getElementById('addRowForm');
    for (let i = 0; i < globalHeadFileds.length; i++) {
        let div = document.createElement('div');
        let input = document.createElement('input');
        input.type = 'text';
        input.name = globalHeadFileds[i];
        input.classList.add('input');
        input.placeholder = globalHeadFileds[i];
        div.appendChild(input);
        form.appendChild(div);
    }

    form.style.display = 'flex';
    document.getElementById('form-container').style.zIndex = '1';
}

// Close the form
function closeForm() {
    closeDynamicFormContent();
    document.getElementById('addRowForm').style.display = 'none';
    document.getElementById('form-container').style.zIndex = '-1';
}

// Get Form data filled by user
function getFormData() {
    const form = document.getElementById('addRowForm');
    // Using FormData Web Api to retrieve the data entered by user through form
    // The ouput of the array of data entered will be displayed at console when form is submitted
    const formReader = new FormData(form);
    let arr = [];
    for (const [key, value] of formReader) {
        arr.push(value);
    }
    closeForm();
    closeDynamicFormContent();
    console.log(arr);
}