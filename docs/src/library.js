var table = document.getElementById('library');

fetch("../data/library.csv")
    .then((res) => res.text())
    .then((csvText) => {
        table.innerHTML = "";
        for (let row of CSV.parse(csvText)) {

            // let tr = table.insertRow();
            // var isbn = 9780804172066;
            // tr.insertCell().innerHtml = `<img src="https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg" />`;
            // tr.insertCell

            for (let col of row) {
                let td = tr.insertCell();
                td.innerHTML = col;
            }
        }
    })
