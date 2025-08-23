import { useState } from "react";

export default function Board() {
  const defaultBoardState = [
    ["", "", ""],
    ["", "X", ""],
    ["", "", ""],
  ];

  const [board, setBoard] = useState(defaultBoardState);

  const [turn, changeTurn] = useState("X");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateBoard(row: number, column: number, player: string) {
    const newBoard = board.map((row) => row.slice());
    newBoard[row][column] = player;
    setBoard(newBoard);
  }

  function displayTie() {
    setMessage("It's a tie!");
  }

  function showError(message: string) {
    setError(message);
  }

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Tic‑Tac‑Toe</h2>
      <div className="grid grid-cols-3 gap-2">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className="aspect-square rounded-xl border border-gray-300 flex items-center justify-center text-3xl font-bold text-gray-700 bg-white"
            >
              {cell || "\u00A0"}
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col items-center">
        <p className="text-blue-500">{message}</p>
      </div>
    </div>
  );
}
