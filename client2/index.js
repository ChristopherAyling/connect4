const generateGrid = (rows, columns, board) => {
    const grid = document.getElementById("grid");
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${columns}, 30px)`;
    grid.style.gridTemplateRows = `repeat(${rows}, 30px)`;

    for (let i = rows*columns-1; i >= 0; i--) {
        const gridItem = document.createElement("div");
        gridItem.classList.add("cell");
        // gridItem.textContent = board[i];
        if (board[i] == 1) {
            gridItem.style.backgroundColor = "red"
        }
        if (board[i] == 2) {
            gridItem.style.backgroundColor = "black"
        }

        grid.appendChild(gridItem);
    }
}

const renderGame = (game) => {
    const grid = document.getElementById("grid")

    console.log(game.nrows)
    generateGrid(game.nrows, game.ncols, game.board)
}

const getGame = async () => {
    const response = await fetch("/api/game")
    const game = await response.json()
    renderGame(game)
    return game
}

window.onload = getGame