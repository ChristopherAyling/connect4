let color = 1

const putCol = async (col) => {
    const params = new URLSearchParams({ col, color }).toString()
    const response = await fetch("/api/game/put?" + params)
    console.log(response)
    await getGame()
}

const generateGrid = (nrows, ncols, board) => {
    const grid = document.getElementById("grid");
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${ncols}, 30px)`;
    grid.style.gridTemplateRows = `repeat(${nrows}, 30px)`;

    for (let i_row = nrows - 1; i_row >= 0; i_row--) {
        for (let i_col = 0; i_col < ncols; i_col++) {
            const i = i_row * ncols + i_col
            const gridItem = document.createElement("div");
            gridItem.classList.add("cell");
            // gridItem.textContent = i;
            if (board[i] == 1) {
                gridItem.style.backgroundColor = "red"
            }
            if (board[i] == 2) {
                gridItem.style.backgroundColor = "black"
            }
            gridItem.addEventListener("click", async () => {
                await putCol(i_col)
            })
            grid.appendChild(gridItem);

        }
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

// setInterval(async () => {
//     await getGame()
// }, 100)