const std = @import("std");

const Board = struct {
    width: usize = 7,
    height: usize = 6,
    buf: [6][7]u8 = undefined,

    pub fn init() Board {
        var board = Board{};

        for (0..board.height) |row| {
            for (0..board.width) |col| {
                board.buf[row][col] = 0;
            }
        }
        return board;
    }

    pub fn show(board: Board, writer: anytype) !void {
        for (0..board.height) |row| {
            for (0..board.width) |col| {
                try writer.print("{}", .{board.buf[board.height - row - 1][col]});
            }
            try writer.writeAll("\n");
        }
    }

    pub fn set(board: *Board, x: usize, y: usize, v: u8) void {
        board.buf[x][y] = v;
    }

    pub fn put(board: *Board, desired_col: usize, v: u8) void {
        for (0..board.height) |row| {
            if (board.buf[row][desired_col] == 0) {
                board.buf[row][desired_col] = v;
                return;
            }
        }
    }

    pub fn get(board: Board, x: usize, y: usize) u8 {
        return board.buf[x][y];
    }
};

var b = Board.init();

export fn init() void {
    b = Board.init();
}

export fn set(x: i32, y: i32, v: i32) void {
    Board.set(&b, @intCast(x), @intCast(y), @intCast(v));
}

export fn put(col: i32, v: i32) void {
    Board.put(&b, @intCast(col), @intCast(v));
}

export fn get(x: i32, y: i32) i32 {
    return Board.get(b, @intCast(x), @intCast(y));
}
