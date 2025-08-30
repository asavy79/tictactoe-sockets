import { useState } from "react";

export default function Board({boardState, makeMove}: {boardState: string[][], makeMove: (row: number, column: number) => void}) {


  console.log(boardState);
  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Tic‑Tac‑Toe</h2>
      <div className="grid grid-cols-3 gap-2">
        {boardState.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div
              key={`${rIdx}-${cIdx}`}
              className="aspect-square rounded-xl border border-gray-300 flex items-center justify-center text-3xl font-bold text-gray-700 bg-white cursor-pointer hover:bg-gray-50"
              onClick={() => makeMove(rIdx, cIdx)}
            >
              {cell || "\u00A0"}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
