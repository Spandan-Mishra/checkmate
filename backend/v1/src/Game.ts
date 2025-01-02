import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;
  private moveCount: number;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.moveCount = 0;
    [this.player1, this.player2].map(player => player.emit(JSON.stringify({
      type: INIT_GAME,
      payload: {
        color: player === this.player1 ? "white" : "black"
      }
    })))
  }

  makeMove(socket: WebSocket, move: {
    from: string,
    to: string
  }) {
    if ((this.moveCount % 2 === 0 && socket !== this.player1) || (this.moveCount % 2 === 1 && socket !== this.player2)) {
      return;
    }

    try {
      this.board.move(move);
    } catch (e) {
      return;
    }

    if (this.board.isGameOver()) {
      [this.player1, this.player2].map(player => player.emit(JSON.stringify({
        type: GAME_OVER,
        payload: {
          winner: this.board.turn() === "w" ? "black" : "white"
        }
      })))
      return;
    }

    if (this.board.moves.length % 2 === 0) {
      this.player2.emit(JSON.stringify({
        type: MOVE,
        payload: move
      }))
    }

    if (this.board.moves.length % 2 === 1) {
      this.player1.emit(JSON.stringify({
        type: MOVE,
        payload: move
      }))
    }

    this.moveCount++;
  }
}
