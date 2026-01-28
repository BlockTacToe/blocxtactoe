'use client';

import { useSubgraphActiveGames, useSubgraphPendingChallenges } from '@/hooks/useSubgraphData';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { Swords, Clock, UserPlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ActiveGamesList() {
  const { address } = useAccount();
  const { games, isLoading: gamesLoading } = useSubgraphActiveGames();
  const { challenges, isLoading: challengesLoading } = useSubgraphPendingChallenges(address || '');

  if (gamesLoading && challengesLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const hasContent = games.length > 0 || (challenges && challenges.length > 0);

  if (!hasContent) {
    return (
      <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
        <Swords className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Active Games</h3>
        <p className="text-gray-400 mb-6">Create a new game to get started!</p>
        <Link 
          href="/create" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Game
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Challenges Section */}
      {challenges && challenges.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Direct Challenges ({challenges.length})
          </h3>
          <div className="grid gap-3">
            {challenges.map((game) => (
              <div 
                key={game.id}
                className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center justify-between hover:bg-yellow-500/20 transition-all"
              >
                <div>
                  <p className="text-white font-medium">
                    Challenge from <span className="text-yellow-400">{game.player1.username || 'Unknown'}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-white">{game.boardSize}x{game.boardSize}</span>
                    <span>{formatEther(BigInt(game.betAmount))} ETH</span>
                  </div>
                </div>
                <Link 
                  href={`/game/${game.gameId}`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Accept
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Public Games Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
          <Swords className="w-4 h-4" />
          Public Games ({games.length})
        </h3>
        <div className="grid gap-3">
          {games.map((game) => (
            <div 
              key={game.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between hover:border-white/20 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                  {game.player1.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-white font-medium flex items-center gap-2">
                    {game.player1.username || 'Anonymous'}
                    <span className="text-xs font-normal text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                      #{game.gameId}
                    </span>
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Grid3x3 className="w-3 h-3" />
                      {game.boardSize}x{game.boardSize}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span className="text-green-400 font-mono">
                      {formatEther(BigInt(game.betAmount))} {game.token === "0x0000000000000000000000000000000000000000" ? "ETH" : "TOKEN"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(Number(game.createdAt) * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <Link 
                href={`/game/${game.gameId}`}
                className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all bg-white text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
              >
                Join <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Grid3x3, Plus } from 'lucide-react';
