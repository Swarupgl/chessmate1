'use client';

import { useState, useEffect, useMemo, useTransition, useCallback } from 'react';
import { Chess, Square, Color } from 'chess.js';
import Chessboard from '@/components/chessboard';
import GameInfoPanel from '@/components/game-info-panel';
import { makeAIMove } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";

export function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState(game.board());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [aiReasoning, setAiReasoning] = useState<string>('');
  const [isAITurn, startTransition] = useTransition();
  const { toast } = useToast();

  const playerColor: Color = 'w';
  const aiColor: Color = 'b';
  const fen = game.fen();

  const updateGame = useCallback((modifier: (game: Chess) => void) => {
    setGame(prevGame => {
      const newGame = new Chess(prevGame.fen());
      modifier(newGame);
      setBoard(newGame.board());
      setMoveHistory(newGame.history({ verbose: true }).map(move => move.san));
      return newGame;
    });
  }, []);

  const resetGame = useCallback(() => {
    const newGame = new Chess();
    setGame(newGame);
    setBoard(newGame.board());
    setMoveHistory([]);
    setAiReasoning('');
    setSelectedSquare(null);
    toast({
      title: 'Game Reset',
      description: 'The board has been reset to the starting position.',
    });
  }, [toast]);
  
  useEffect(() => {
    const gameInstance = new Chess(fen);
    if (gameInstance.turn() === aiColor && !gameInstance.isGameOver()) {
      startTransition(async () => {
        const result = await makeAIMove(fen);
        if ('move' in result) {
          updateGame(g => {
            const moveResult = g.move(result.move);
            if (!moveResult) {
              console.error("AI made an invalid move:", result.move);
              toast({
                title: "AI Error",
                description: `The AI suggested an invalid move: ${result.move}. Please reset the game.`,
                variant: "destructive",
              });
            } else {
              setAiReasoning(result.reasoning);
            }
          });
        } else {
          toast({
            title: "AI Error",
            description: result.error,
            variant: "destructive",
          });
        }
      });
    }
  }, [fen, aiColor, toast, updateGame]);

  const handleSquareClick = (square: Square) => {
    if (game.turn() !== playerColor || isAITurn) return;

    if (selectedSquare) {
      try {
        const move = { from: selectedSquare, to: square, promotion: 'q' }; // auto-promote to queen
        updateGame(g => {
          const result = g.move(move);
          if (!result) {
            // Not a valid move, so maybe they want to select another piece
            const piece = g.get(square);
            if (piece && piece.color === playerColor) {
              setSelectedSquare(square);
            } else {
              setSelectedSquare(null);
            }
          } else {
             setSelectedSquare(null);
          }
        });
      } catch (e) {
        // Invalid move, potentially. Deselect.
        setSelectedSquare(null);
      }
    } else {
      const piece = game.get(square);
      if (piece && piece.color === playerColor) {
        setSelectedSquare(square);
      }
    }
  };
  
  const possibleMoves = useMemo(() => {
    if (!selectedSquare) return [];
    const moves = game.moves({ square: selectedSquare, verbose: true });
    return moves.map(move => move.to);
  }, [selectedSquare, game]);

  const gameStatus = useMemo(() => {
    if (game.isCheckmate()) return `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`;
    if (game.isCheck()) return "Check!";
    if (game.isStalemate()) return "Stalemate!";
    if (game.isThreefoldRepetition()) return "Draw by threefold repetition!";
    if (game.isDraw()) return "Draw!";
    return "In Progress";
  }, [game]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 justify-center items-start">
      <div className="w-full max-w-lg mx-auto lg:max-w-none lg:w-auto lg:mx-0">
         <Chessboard
          board={board}
          onSquareClick={handleSquareClick}
          selectedSquare={selectedSquare}
          possibleMoves={possibleMoves}
          playerColor={playerColor}
          lastMove={game.history({verbose: true}).slice(-1)[0]}
        />
      </div>
      <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
        <GameInfoPanel
          status={gameStatus}
          turn={game.turn()}
          isAITurn={isAITurn}
          moveHistory={moveHistory}
          aiReasoning={aiReasoning}
          onReset={resetGame}
        />
      </aside>
    </div>
  );
}
