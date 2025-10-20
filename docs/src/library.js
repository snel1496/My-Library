var table = document.getElementById("library");
var keepCols = { Title: -1, Subtitle: -1, Series: -1, Volume: -1, Author: -1, 'Date Published': -1, 'Original Date Published': -1, Edition: -1, Genre: -1, 'Word Count': -1, 'Number of Pages': -1, ISBN: -1, 'Date Added': -1 }
var csvParsed;

fetch("https://raw.githubusercontent.com/snel1496/My-Library/refs/heads/main/docs/data/library.csv")
    .then(res => res.text())
    .then(csvRaw => {
        table.innerHTML = "";
        let csvParsed = CSV.parse(csvRaw);

        let thead = table.createTHead();
        thead.class = "thead-light";

        let tbody = table.createTBody();
        for (let i = 0; i < csvParsed.length; i++) {
            if (i == 0) {
                let tr = thead.insertRow();
                tr.insertCell().innerHTML = "Image"; // add space for image
                for (let j = 0; j < csvParsed[i].length; j++) { 
                    if (keepCols[csvParsed[i][j]]) {
                        keepCols[csvParsed[i][j]] = j;
                        let td = tr.insertCell();
                        td.innerHTML = csvParsed[i][j];
                        td.onClick = "sortTableByColumn(j)";
                    }
                }
            } else {
                let tr = tbody.insertRow();
                let td = tr.insertCell();
                td.innerHTML = `<img src="https://covers.openlibrary.org/b/isbn/${csvParsed[i][keepCols.ISBN]}-S.jpg" />`
                for (const [_, value] of Object.entries(keepCols)) {
                    let td = tr.insertCell();
                    td.innerHTML = csvParsed[i][value];
                }
            }
        }
    });


function filterColumnByString(filterString, filterColumnIdx) { // this could be rewritten to use 
    let rows = table.tBodies[0].rows;
    for (row of rows) {
        row.style = "";
        if (row.cells[filterColumnIdx].textContent != filterString) { // todo make this more than an exact match
            row.style = "display: none";
        }
    }
}

function sortTableByColumn(columnIdx) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("mySortableTable");
    switching = true;
    dir = "asc"; // Set the initial sorting direction to ascending

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) { // Loop through all rows except the header
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

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
