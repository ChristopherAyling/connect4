console.log("in the loader")
request = new XMLHttpRequest();
request.open("GET", "c4.wasm", true);
request.responseType = "arraybuffer";
request.send()

const width = 7;  // Assuming standard Connect Four width
const height = 6; // Assuming standard Connect Four height

var funcs = null;

const render = () => {
    const width = 7;  // Assuming standard Connect Four width
    const height = 6; // Assuming standard Connect Four height

    for (let row = 0; row < height; row++) {
        const row_data = [];
        for (let col = 0; col < width; col++) {
            const value = funcs.get(row, col);

            const cellIndex = (height - row - 1) * width + col;
            const cell = document.querySelectorAll('.cell')[cellIndex];
            if (value === 1) {
                cell.style.backgroundColor = 'red';
            } else if (value === 2) {
                cell.style.backgroundColor = 'black';
            } else {
                cell.style.backgroundColor = 'white';
            }
        }
    }
}

var reset_button = document.getElementById("reset_button");

reset_button.onclick = () => {
    console.log("reset");
    funcs.init();
    render();
}

request.onload = () => {
    var bytes = request.response;
    WebAssembly.instantiate(bytes, {
        env: {
            print: (result) => { console.log(`The result is ${result}`); }
        }
    }).then(result => {
        funcs = result.instance.exports;
        // const init = result.instance.exports.init;
        // const set = result.instance.exports.set;
        // const put = result.instance.exports.put;
        // const get = result.instance.exports.get;

        // funcs.put(0, 1);
        // funcs.put(0, 2);

        // funcs.put(4, 1);
        // funcs.put(5, 2);

        render();

        console.log("done");
    });
}

var active_color = 2;

const click_col = (col) => {
    console.log("clicked col " + col);
    funcs.put(col, active_color);
    active_color = 3 - active_color;
    // change #cursor-follower background-color css
    document.getElementById("cursor-follower").style.backgroundColor = active_color === 1 ? "red" : "black";
    render();
}

const grid = document.getElementById("grid");
for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
        console.log("made cell");
        const cell = document.createElement("div");
        cell.addEventListener("click", () => {
            click_col(col);
        });
        cell.classList.add("cell");
        grid.appendChild(cell);
    }
}
console.log("done making grid");