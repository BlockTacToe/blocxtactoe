"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useSubgraphGame, useSubgraphMoves, SubgraphMove } from "@/hooks/useSubgraphData";
import { GameBoard } from "./GameBoard";
import { Play, SkipBack, SkipForward, Pause } from "lucide-react";

interface GameDetailsProps {
  gameId: string;
}

export default function GameDetails({ gameId }: GameDetailsProps) {
  const { game, isLoading: gameLoading } = useSubgraphGame(gameId);
  const { moves, isLoading: movesLoading } = useSubgraphMoves(gameId);

  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const boardSize = game?.boardSize ?? 3;
  const totalCells = boardSize * boardSize;

  // Derived board applying moves up to currentIndex
  const board = useMemo(() => {
    const b: ("X" | "O" | null)[] = Array(totalCells).fill(null);
    const applied = moves.slice(0, currentIndex + 1);
    applied.forEach((m) => {
      const idx = m.row * boardSize + m.col;
      b[idx] = m.symbol === 1 ? "X" : "O";
    });
    return b;
  }, [moves, currentIndex, boardSize, totalCells]);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((i) => {
        if (i >= moves.length - 1) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 700);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, moves.length]);

  useEffect(() => {
    // reset index when moves change
    setCurrentIndex(moves.length > 0 ? moves.length - 1 : -1);
  }, [moves.length]);

  if (gameLoading) return <div>Loading game...</div>;

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Game #{game?.gameId}</h1>
            <p className="text-sm text-gray-400">Board size: {boardSize}x{boardSize} — Bet: {game?.betAmount}</p>
            <p className="text-sm text-gray-400">Players: {game?.player1.username} {game?.player2 ? `vs ${game.player2.username}` : '(waiting)'}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/games" className="text-sm px-3 py-2 rounded bg-white/10 border border-white/10">Back</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <GameBoard board={board} onCellClick={() => {}} disabled={true} boardSize={boardSize} />

            <div className="mt-4 flex items-center gap-2">
              <button
                className="px-3 py-2 bg-white/10 rounded border border-white/10"
                onClick={() => setCurrentIndex((i) => Math.max(-1, i - 1))}
                disabled={currentIndex < 0}
              >
                <SkipBack />
              </button>
              <button
                className="px-3 py-2 bg-white/10 rounded border border-white/10"
                onClick={() => setIsPlaying((p) => !p)}
                disabled={moves.length === 0}
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>
              <button
                className="px-3 py-2 bg-white/10 rounded border border-white/10"
                onClick={() => setCurrentIndex(moves.length - 1)}
                disabled={currentIndex >= moves.length - 1}
              >
                <SkipForward />
              </button>
              <div className="ml-4 text-sm text-gray-300">Move {currentIndex + 1} / {moves.length}</div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Moves</h2>
            <div className="bg-white/5 p-3 rounded space-y-2 max-h-96 overflow-auto">
              {movesLoading ? (
                <div>Loading moves...</div>
              ) : moves.length === 0 ? (
                <div className="text-sm text-gray-400">No moves yet.</div>
              ) : (
                moves.map((m, idx) => (
                  <div
                    key={m.id}
                    className={`p-2 rounded ${idx === currentIndex ? 'bg-white/10' : ''} flex justify-between items-center`}
                  >
                    <div>
                      <div className="text-sm font-medium">{m.player.username}</div>
                      <div className="text-xs text-gray-400">{`r:${m.row} c:${m.col} — symbol:${m.symbol === 1 ? 'X' : 'O'}`}</div>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(Number(m.timestamp)).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
