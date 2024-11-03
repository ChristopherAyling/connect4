package main

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
)

type Game struct {
	nrows int
	ncols int
	buf   []int
}

func newGame(nrows int, ncols int) *Game {
	buf := make([]int, nrows*ncols)
	game := Game{nrows: nrows, ncols: ncols, buf: buf}
	return &game
}

func (g Game) get(row int, col int) int {
	return g.buf[row*g.ncols+col]
}

func (g *Game) set(row int, col int, value int) {
	g.buf[row*g.ncols+col] = value
}

func (g Game) print() {
	for row := g.nrows - 1; row >= 0; row-- {
		for col := 0; col < g.ncols; col++ {
			fmt.Printf("%d", g.get(row, col))
		}
		fmt.Printf("\n")
	}
}

func getRoot(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("got / request\n")
	io.WriteString(w, "hello world\n")
}

var game = newGame(6, 7)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", getRoot)

	game.set(0, 3, 7)
	game.print()

	fmt.Printf("listening...\n")
	err := http.ListenAndServe(":3333", mux)

	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("server closed\n")
	} else if err != nil {
		fmt.Printf("error starting server %s\n", err)
		os.Exit(1)
	}
}
