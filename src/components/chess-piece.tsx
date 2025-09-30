import type { Piece } from 'chess.js';
import { Castle, Shield, Crown, Circle, LucidePawn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FaHorse } from 'react-icons/fa';

interface ChessPieceProps {
  piece: Piece;
}

const pieceMap = {
  r: Castle,
  n: FaHorse,
  b: Shield,
  q: Crown,
  k: Circle,
  p: LucidePawn,
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
        strokeWidth={piece.type === 'n' ? 0 : 1}
      />
    </div>
  );
}
