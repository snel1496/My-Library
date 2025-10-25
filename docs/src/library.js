var table = document.getElementById("library");
var searchBox = document.getElementById("search-box");
var seriesDropdown = document.getElementById("series-dropdown");
var seriesSet = new Set();
var authorDropdown = document.getElementById("author-dropdown");
var authorSet = new Set();

var keepCols = { Title: -1, Subtitle: -1, Series: -1, Volume: -1, Author: -1, 'Date Published': -1, 'Word Count': -1, Genre: -1, 'Number of Pages': -1, ISBN: -1, 'Date Added': -1 }

fetch("https://raw.githubusercontent.com/snel1496/My-Library/refs/heads/main/docs/data/library.csv") // TODO this function should probably be split up
    .then(res => res.text())
    .then(csvRaw => {
        table.innerHTML = "";
        let csvParsed = CSV.parse(csvRaw);
        configureTable(csvParsed);
    })
    .then(() => { onReady() });

//Stuff to do after the data has been parsed and processed
function onReady() {
    configDropDown(seriesDropdown, seriesSet, keepCols.Series);
    configDropDown(authorDropdown, authorSet, keepCols.Author);
}

function configDropDown(dropdownElement, dropdownSet, filterColumnIdx) {
    dropdownElement.innerHTML = "";
    dropdownElement.addEventListener('change', () => { filterColumnByString(dropdownElement.value, filterColumnIdx) })
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
                if (keepCols[libraryData[i][j]]) {
                    keepCols[libraryData[i][j]] = j;
                    let td = tr.insertCell();
                    td.innerHTML = `${libraryData[i][j]}<button class="btn" onclick="sortTableByColumn(${j})"><i class="fa fa-sort"></i></button>`; // TODO do something to change the icon to fa-sort-down or fa-sort-up when appropriate, it also looks weird on the site
                }
            }
        } else {
            let tr = tbody.insertRow();
            let td = tr.insertCell();
            td.innerHTML = `<img src="https://covers.openlibrary.org/b/isbn/${libraryData[i][keepCols.ISBN]}-S.jpg" />`
            for (const [_, idx] of Object.entries(keepCols)) {
                let td = tr.insertCell();
                td.innerHTML = libraryData[i][idx];
                switch (idx) {
                    case keepCols.Author:
                        authorSet.add(libraryData[i][idx]);
                        break;
                    case keepCols.Series:
                        seriesSet.add(libraryData[i][idx]);
                        break;
                    default:
                        break;
                }
            }
        }
    }
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
    let rows = table.tBodies[0].rows;
    for (row of rows) {
        row.style = "";
        if (filterString != "undefined" && row.cells[filterColumnIdx].textContent != filterString) { // todo make this more than an exact match it also doesnt work when things have spaces?
            row.style = "display: none";
        }
    }
}