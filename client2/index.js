const getRoomName = () => {
    return new URL(document.location.toString()).searchParams.get("name")
}

let color = 2

const putCol = async (col) => {
    const params = new URLSearchParams({ col, color, name: getRoomName() }).toString()
    const response = await fetch("/api/game/put?" + params)
    console.log(response)
}

let domgrid = null

const colorDomGrid = (board) => {
    console.log("redrawing")
    for (let i = 0; i < board.length; i++) {
        let gridItem = domgrid[i]
        if (board[i] == 1) {
            gridItem.style.backgroundColor = "red"
        } else if (board[i] == 2) {
            gridItem.style.backgroundColor = "black"
        } else {
            gridItem.style.backgroundColor = null
        }

    }
}


const generateGrid = (nrows, ncols, board) => {
    const grid = document.getElementById("grid");
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${ncols}, 30px)`;
    grid.style.gridTemplateRows = `repeat(${nrows}, 30px)`;

    domgrid = Array(nrows * ncols)

    for (let i_row = nrows - 1; i_row >= 0; i_row--) {
        for (let i_col = 0; i_col < ncols; i_col++) {
            const i = i_row * ncols + i_col
            const gridItem = document.createElement("div");
            gridItem.classList.add("cell");
            // gridItem.textContent = i;
            gridItem.addEventListener("click", async () => {
                await putCol(i_col)
            })
            domgrid[i] = gridItem
            grid.appendChild(gridItem);
        }
    }
    colorDomGrid(board)
}

const renderGame = (game) => {
    const grid = document.getElementById("grid")

    console.log(game.nrows)
    generateGrid(game.nrows, game.ncols, game.board)
}

const getGame = async () => {
    const params = new URLSearchParams({ name: getRoomName() }).toString()
    const response = await fetch("/api/game?" + params)
    const game = await response.json()
    renderGame(game)
    return game
}

const longPoll = async () => {
    console.log("long poll started")
    const params = new URLSearchParams({ name: getRoomName() }).toString()
    const response = await fetch("/api/game/longpoll?" + params)
    const game = await response.json()
    console.log("long poll finished")

    colorDomGrid(game.board)

    await longPoll()
}

window.onload = async () => {
    await getGame()

    document.getElementById("resetButton").onclick = async () => {
        const params = new URLSearchParams({ name: getRoomName }).toString()
        await fetch("/api/game/reset?" + params)
    }

    const cursorFollower = document.getElementById('cursor-follower');

    document.addEventListener('mousemove', (e) => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    });

    document.getElementById("changeColor").onclick = async () => {
        color = color === 1 ? 2 : 1
        document.getElementById("cursor-follower").style.backgroundColor = color === 1 ? "red" : "black";
    }

    await longPoll()
}
