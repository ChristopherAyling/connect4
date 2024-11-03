# Connect 4 Implementations

## Multiplayer Connect 4 in Zig

```bash
cd gomultiplayer
go run server.go
```

Then open [http://localhost:3333/?name=SOME_ROOM_NAME](http://localhost:3333?name=SOME_ROOM_NAME) in your web browser.

Open two browser windows or host it in someway and play from two different devices.

## Connect 4 In Zig + WASM

![Connect 4 Screenshot](screenshot.png)

```bash
cd c4zigwasm
bash build.sh
python -m http.server # (or any other web server)
```

Then open [http://localhost:8000](http://localhost:8000) in your web browser.
