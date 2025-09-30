'use client';

import { useMemo } from 'react';
import type { Piece, Square, Move } from 'chess.js';
import { ChessPiece } from '@/components/chess-piece';
import { cn } from '@/lib/utils';

type Board = (Piece | null)[][];

interface ChessboardProps {
  board: Board;
  onSquareClick: (square: Square) => void;
  selectedSquare: Square | null;
  possibleMoves: Square[];
  playerColor: 'w' | 'b';
  lastMove?: Move;
}

export default function Chessboard({ board, onSquareClick, selectedSquare, possibleMoves, playerColor, lastMove }: ChessboardProps) {
  const ranks = useMemo(() => playerColor === 'w' ? ['8', '7', '6', '5', '4', '3', '2', '1'] : ['1', '2', '3', '4', '5', '6', '7', '8'], [playerColor]);
  const files = useMemo(() => playerColor === 'w' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'], [playerColor]);

  const displayBoard = useMemo(() => {
    return playerColor === 'w' ? board : [...board].reverse().map(row => [...row].reverse());
  }, [board, playerColor]);

  return (
    <div className="relative w-full aspect-square max-w-[calc(100vh-12rem)] mx-auto">
      <div className="grid grid-cols-8 w-full h-full shadow-lg rounded-md overflow-hidden border-2 bg-background border-card">
        {displayBoard.flat().map((piece, index) => {
          const row = Math.floor(index / 8);
          const col = index % 8;
          
          const rank = ranks[row];
          const file = files[col];
          const square = `${file}${rank}` as Square;
          
          const isLight = (row + col) % 2 !== 0;
          const isSelected = square === selectedSquare;
          const isPossibleMove = possibleMoves.includes(square);
          const isLastMove = square === lastMove?.from || square === lastMove?.to;

          return (
            <div
              key={square}
              onClick={() => onSquareClick(square)}
              className={cn(
                "relative flex items-center justify-center cursor-pointer group",
                isLight ? 'bg-[hsl(var(--board-light))]' : 'bg-[hsl(var(--board-dark))]',
              )}
            >
              <span className={cn("absolute top-0 left-1 text-xs font-bold opacity-50", isLight ? "text-[hsl(var(--board-dark))]" : "text-[hsl(var(--board-light))]")}>
                {col === 0 && rank}
              </span>
              <span className={cn("absolute bottom-0 right-1 text-xs font-bold opacity-50", isLight ? "text-[hsl(var(--board-dark))]" : "text-[hsl(var(--board-light))]")}>
                {row === 7 && file}
              </span>
              {isLastMove && <div className="absolute inset-0 bg-accent/30" />}
              {isSelected && <div className="absolute inset-0 bg-accent/50" />}
              <div className="relative w-full h-full p-1 transition-transform duration-100 group-hover:scale-105 z-10">
                {piece && <ChessPiece piece={piece} />}
              </div>
              {isPossibleMove && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className={cn(
                    "rounded-full bg-accent/50",
                    piece ? "w-full h-full border-4 border-accent/70 bg-transparent" : "w-1/3 h-1/3"
                  )} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
