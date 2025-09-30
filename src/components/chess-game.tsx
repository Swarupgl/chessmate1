'use client';

import { useState, useEffect, useMemo, useTransition, useCallback } from 'react';
import { Chess, Square, Color, Piece } from 'chess.js';
import Chessboard from '@/components/chessboard';
import GameInfoPanel from '@/components/game-info-panel';
import { makeAIMove } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";

type GameMode = 'pvp' | 'pva';

export function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState<(Piece | null)[][]>(game.board());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [aiReasoning, setAiReasoning] = useState<string>('');
  const [isAITurn, startTransition] = useTransition();
  const { toast } = useToast();
  const [gameMode, setGameMode] = useState<GameMode>('pva');
  const [playerColor, setPlayerColor] = useState<Color>('w');

  const aiColor: Color = playerColor === 'w' ? 'b' : 'w';
  const fen = game.fen();

  const updateGame = useCallback((modifier: (game: Chess) => boolean | void, fromFen?: string) => {
    setGame(prevGame => {
      const newGame = fromFen ? new Chess(fromFen) : new Chess(prevGame.fen());
      const shouldUpdate = modifier(newGame);
      if (shouldUpdate === false) {
        return prevGame;
      }
      setBoard(newGame.board());
      setMoveHistory(newGame.history({ verbose: true }).map(move => move.san));
      return newGame;
    });
  }, []);

  const resetGame = useCallback(() => {
    updateGame(g => {
      g.reset();
    });
    setAiReasoning('');
    setSelectedSquare(null);
    toast({
      title: 'Game Reset',
      description: 'The board has been reset to the starting position.',
    });
  }, [toast, updateGame]);
  
  useEffect(() => {
    if (gameMode === 'pva' && game.turn() === aiColor && !game.isGameOver()) {
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
          }, fen);
        } else {
          toast({
            title: "AI Error",
            description: result.error,
            variant: "destructive",
          });
        }
      });
    }
  }, [fen, aiColor, toast, updateGame, gameMode, game]);

  const handleSquareClick = (square: Square) => {
    if (isAITurn && gameMode === 'pva') return;

    const currentPlayerColor = game.turn();

    if (gameMode === 'pva' && currentPlayerColor !== playerColor) return;

    if (selectedSquare) {
      const move = { from: selectedSquare, to: square, promotion: 'q' }; // Auto-promote to queen for simplicity
      updateGame(g => {
        try {
          const result = g.move(move);
          if (!result) {
            const piece = g.get(square);
            if (piece && piece.color === currentPlayerColor) {
              setSelectedSquare(square);
            } else {
              setSelectedSquare(null);
            }
            return false; // Prevent state update if move is invalid but doesn't throw
          } else {
             setSelectedSquare(null);
          }
        } catch (e) {
            // This catches illegal move errors from chess.js
            const piece = g.get(square);
            if (piece && piece.color === currentPlayerColor) {
              setSelectedSquare(square);
            } else {
              setSelectedSquare(null);
            }
            return false; // Prevent state update on error
        }
      }, fen);
    } else {
      const piece = game.get(square);
      if (piece && piece.color === currentPlayerColor) {
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

  const handleGameModeChange = (mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 justify-center items-start">
      <div className="w-full max-w-lg mx-auto lg:max-w-none lg:w-auto lg:mx-0">
         <Chessboard
          board={board}
          onSquareClick={handleSquareClick}
          selectedSquare={selectedSquare}
          possibleMoves={possibleMoves}
          playerColor={gameMode === 'pva' ? playerColor : game.turn()}
          lastMove={game.history({verbose: true}).slice(-1)[0]}
        />
      </div>
      <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
        <GameInfoPanel
          status={gameStatus}
          turn={game.turn()}
          isAITurn={isAITurn && gameMode === 'pva'}
          moveHistory={moveHistory}
          aiReasoning={aiReasoning}
          onReset={resetGame}
          gameMode={gameMode}
          onGameModeChange={handleGameModeChange}
        />
      </aside>
    </div>
  );
}
