import type { Piece } from 'chess.js';
import { ChessRook, ChessKnight, ChessBishop, ChessQueen, ChessKing, ChessPawn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChessPieceProps {
  piece: Piece;
}

const pieceMap = {
  r: ChessRook,
  n: ChessKnight,
  b: ChessBishop,
  q: ChessQueen,
  k: ChessKing,
  p: ChessPawn,
};

export function ChessPiece({ piece }: ChessPieceProps) {
  const Icon = pieceMap[piece.type];
  if (!Icon) return null;

  return (
    <div className="w-full h-full drop-shadow-md">
       <Icon
        className={cn(
          "w-full h-full",
          piece.color === 'w' 
            ? 'fill-[hsl(var(--piece-white-fill))] text-[hsl(var(--piece-white-stroke))]' 
            : 'fill-[hsl(var(--piece-black-fill))] text-[hsl(var(--piece-black-stroke))]'
        )}
        strokeWidth={1}
      />
    </div>
  );
}
