var table = document.getElementById("library");
var searchBox = document.getElementById("search-box");
var seriesDropdown = document.getElementById("series-dropdown");
var seriesSet = new Set();
var authorDropdown = document.getElementById("author-dropdown");
var authorSet = new Set();

var tableCols = { Title: -1, Subtitle: -1, Series: -1, Volume: -1, Author: -1, 'Date Published': -1, Genre: -1, 'Number of Pages': -1, ISBN: -1, 'Date Added': -1 }
var additionalCols = { Summary: -1 }

fetch("https://raw.githubusercontent.com/snel1496/My-Library/refs/heads/main/docs/data/library.csv") // TODO this function should probably be split up
    .then(res => res.text())
    .then(csvRaw => {
        table.innerHTML = "";
        let csvParsed = CSV.parse(csvRaw);
        configureTable(csvParsed);
    })
    .then(() => { onReady() });

// configure MiniSearch https://github.com/lucaong/minisearch
//Stuff to do after the data has been parsed and processed
function onReady() {
    configDropDown(seriesDropdown, seriesSet, tableCols.Series);
    configDropDown(authorDropdown, authorSet, tableCols.Author);
    searchBox.addEventListener('input', () => filterColumnByString(searchBox.value, tableCols.Title));
}

function configDropDown(dropdownElement, dropdownSet, filterColumnIdx) {
    dropdownElement.innerHTML = "";
    dropdownElement.addEventListener('change', () => { filterColumnByString(dropdownElement.value, filterColumnIdx) }, false)
    dropdownSet.forEach(item => {
        if (item == null || item == undefined) {
            dropdownElement.innerHTML = `${dropdownElement.innerHTML}<option value="undefined">undefined</option>`;
            return;
        }

        let itemList = item?.split(",");
        let entry = [];
        itemList.every((value, index) => {
            if (index == 3) {
                entry.push("et. al.");
                return false;
            }
            entry.push(value);
            return true;
        });
        let res = entry.join();
        dropdownElement.innerHTML = `${dropdownElement.innerHTML}<option value="${res}">${res}</option>`;
    });
}

function configureTable(libraryData) {
    let thead = table.createTHead();
    thead.class = "thead-light";

    let tbody = table.createTBody();
    for (let i = 0; i < libraryData.length; i++) {
        if (i == 0) {
            let tr = thead.insertRow();
            tr.insertCell().innerHTML = "Image"; // add space for image
            for (let j = 0; j < libraryData[i].length; j++) {
                if (tableCols[libraryData[i][j]]) {
                    tableCols[libraryData[i][j]] = j;
                    let td = tr.insertCell();
                    td.innerHTML = `${libraryData[i][j]}<button class="btn" onclick="sortTableByColumn(${j})"><i class="fa fa-sort"></i></button>`; // TODO do something to change the icon to fa-sort-down or fa-sort-up when appropriate, it also looks weird on the site
                } else if (additionalCols[libraryData[i][j]]) {
                    additionalCols[libraryData[i][j]] = j;
                }
            }
        } else {
            let tr = tbody.insertRow();
            tr.onclick = () => { renderBookPage(libraryData[i]) }
            let td = tr.insertCell();
            td.innerHTML = `<img src=${getImageUrl(libraryData[i][tableCols.ISBN], 'S')} alt="BookImage if available">`;
            for (const [_, idx] of Object.entries(tableCols)) {
                let td = tr.insertCell();
                td.innerHTML = libraryData[i][idx];
                switch (idx) {
                    case tableCols.Author:
                        authorSet.add(libraryData[i][idx]);
                        break;
                    case tableCols.Series:
                        seriesSet.add(libraryData[i][idx]);
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

function renderBookPage(dataRow) {
    document.getElementById("book-view").style = "display: block";
    document.getElementById("bImage").src = getImageUrl(dataRow[tableCols.ISBN], 'M'); // TODO change url if screen gets too small
    document.getElementById("bLink").href = `https://openlibrary.org/isbn/${dataRow[tableCols.ISBN]}`;
    document.getElementById("bTitle").innerHTML = dataRow[tableCols.Title];
    document.getElementById("bAuthor").innerHTML = `Author: ${dataRow[tableCols.Author]}`;
    document.getElementById("bSubtitle").innerHTML = dataRow[tableCols.Subtitle];
    document.getElementById("bSeries").innerHTML = `Series ${dataRow[tableCols.Series]}`;
    document.getElementById("bVolume").innerHTML = `Volumn: ${dataRow[tableCols.Volume]}`;
    document.getElementById("bGenre").innerHTML = `Genre: ${dataRow[tableCols.Genre]}`;
    document.getElementById("bSummary").innerHTML = dataRow[additionalCols.Summary];
    document.getElementById("bPublishedDate").innerHTML = `Published: ${dataRow[tableCols["Date Published"]]}`;
    document.getElementById("bDateAdded").innerHTML = `Date Added To Collection: ${dataRow[tableCols["Date Added"]]}`;
    document.getElementById("bIsbn").innerHTML = `ISBN: ${dataRow[tableCols.ISBN]}`;
}

function getImageUrl(isbn, size) {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
}
function sortTableByColumn(columnIdx) {
    var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;
    dir = "asc"; // Set the initial sorting direction to ascending

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) { // Loop through all rows except the header
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[columnIdx];
            y = rows[i + 1].getElementsByTagName("TD")[columnIdx];

            // Check if the two rows should switch place
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function filterColumnByString(filterString, filterColumnIdx) { // this could be rewritten to use the background data instead of just making things invisible
    console.log(`Filtering Column: ${filterColumnIdx}, by: ${filterString}`);
    let rows = table.tBodies[0].rows;
    for (row of rows) {
        row.style = "";
        if (!isStringNullOrEmpty(filterColumnByString) && !row.cells[filterColumnIdx].textContent.includes(filterString)) { // todo make this more than an exact match it also doesnt work when things have spaces?
            row.style = "display: none";
        }
    }
}

function isStringNullOrEmpty(input) {
    if (input == null
        || input == undefined
        || input == "undefinded"
        || input.length == 0
    ) {
        return true;
    }
    return false;
}