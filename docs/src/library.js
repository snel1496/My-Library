var table = document.getElementById("library");
var keepCols = { Title: -1, Subtitle: -1, Series: -1, Volume: -1, Author: -1, 'Date Published': -1, 'Original Date Published': -1, Edition: -1, Genre: -1, Summary: -1, 'Word Count': -1, 'Number of Pages': -1, ISBN: -1, 'Date Added': -1 }

fetch("https://raw.githubusercontent.com/snel1496/My-Library/refs/heads/main/docs/data/library.csv")
    .then(res => res.text())
    .then(csvRaw => {
        table.innerHTML = "";
        let csvParsed = CSV.parse(csvRaw);
        for (let i = 0; i < csvParsed.length; i++) {
            let tr = table.insertRow();
            if (i == 0) {
                for (let j = 0; j < row.length; j++) {
                    if (keepCols[row[j]]) {
                        keepCols[row[j]] = j;
                        let td = tr.insertCell();
                        td.innerHTML = csvParsed[i][j];
                    }
                }
            } else {
                for (const [_, value] of Object.entries(keepCols)) {
                    let td = tr.insertCell();
                    td.innerHTML = csvParsed[i][value];
                }
            }
        }
    });
