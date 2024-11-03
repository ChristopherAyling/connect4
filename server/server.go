package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
)

type Game struct {
	Nrows   int   `json:"nrows"`
	Ncols   int   `json:"ncols"`
	Board   []int `json:"board"`
	Step    int   `json:"step"`
	waiters []chan int
}

func newGame(nrows int, ncols int) *Game {
	board := make([]int, nrows*ncols)
	g := Game{Nrows: nrows, Ncols: ncols, Board: board}
	g.wakeUpdateWaiters()
	return &g
}

func (g *Game) get(row int, col int) int {
	return g.Board[row*g.Ncols+col]
}

func (g *Game) set(row int, col int, value int) {
	g.Board[row*g.Ncols+col] = value
}

func (g *Game) put(col int, value int) {
	for row := 0; row < g.Nrows; row++ {
		if g.get(row, col) == 0 {
			g.set(row, col, value)
			g.wakeUpdateWaiters()
			return
		}
	}
}

func (g *Game) waitForUpdate() {
	fmt.Printf("waiting\n")
	c := make(chan int)
	g.waiters = append(g.waiters, c)
	<-c
	fmt.Printf("waited\n")
}

func (g *Game) wakeUpdateWaiters() {
	fmt.Printf("waking waiters\n")
	for i := 0; i < len(g.waiters); i++ {
		g.waiters[i] <- 88
	}
	fmt.Printf("woke waiters\n")
	g.waiters = make([]chan int, 0)
}

func (g Game) print() {
	for row := g.Nrows - 1; row >= 0; row-- {
		for col := 0; col < g.Ncols; col++ {
			fmt.Printf("%d", g.get(row, col))
		}
		fmt.Printf("\n")
	}
}

var game = newGame(6, 7)

func getGame(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("got / request\n")
	game_json, _ := json.Marshal(game)
	io.WriteString(w, string(game_json))
}

func putToken(w http.ResponseWriter, r *http.Request) {
	col_string := r.URL.Query().Get("col")
	col, _ := strconv.Atoi(col_string)
	colour_string := r.URL.Query().Get("color")
	color, _ := strconv.Atoi(colour_string)

	game.put(col, color)
	io.WriteString(w, "done")
}

func resetGame(w http.ResponseWriter, r *http.Request) {
	fmt.Printf("reseting\n")
	game = newGame(game.Nrows, game.Ncols)
}

func longPoll(w http.ResponseWriter, r *http.Request) {
	game.waitForUpdate()
	game_json, _ := json.Marshal(game)
	io.WriteString(w, string(game_json))
}

func main() {
	http.HandleFunc("/api/game", getGame)
	http.HandleFunc("/api/game/put", putToken)
	http.HandleFunc("/api/game/reset", resetGame)
	http.HandleFunc("/api/game/longpoll", longPoll)
	fs := http.FileServer(http.Dir("../client2"))
	http.Handle("/", fs)

	fmt.Printf("listening...\n")
	err := http.ListenAndServe(":3333", nil)

	if errors.Is(err, http.ErrServerClosed) {
		fmt.Printf("server closed\n")
	} else if err != nil {
		fmt.Printf("error starting server %s\n", err)
		os.Exit(1)
	}
}
