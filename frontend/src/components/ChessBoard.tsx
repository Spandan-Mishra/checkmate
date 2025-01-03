import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../pages/Game";

export const ChessBoard = ({ chess, socket, setBoard, board }: {
  chess: any,
  socket: WebSocket,
  setBoard: any,
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][]
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [to, setTo] = useState<Square | null>(null);

  return (
    <div className="text-white-200">
      {board.map((row, i) => {
        return <div key={i} className="flex">
          {row.map((square, j) => {
            const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
            return <div onClick={() => {
              if (!from) {
                setFrom(squareRepresentation);
              } else {
                socket.send(JSON.stringify({
                  type: MOVE,
                  payload: {
                    move: {
                      from,
                      to: squareRepresentation
                    }
                  }
                }))

                setFrom(null);
                chess.move({
                  from,
                  to: squareRepresentation
                })
                setBoard(chess.board());
                console.log({
                  from,
                  to: squareRepresentation
                })
              }
            }} key={j} className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-red-950' : 'bg-orange-200'}`}>
              <div className="w-full h-full flex justify-center items-center">
                {square ? square.type : ""}
              </div>
            </div>
          })}
        </div>
      })}
    </div>

  )
}
