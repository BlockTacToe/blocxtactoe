'use client';

import { useAccount } from 'wagmi';
import { useSubgraphPlayerGames } from '@/hooks/useSubgraphData';
import { formatEther } from 'viem';
import { Trophy, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { useSubgraph } from '@/hooks/useSubgraph';
import { useEffect, useState } from 'react';

interface PlayerStats {
  totalVolume: string;
  netEarnings: string;
  biggestWin: string;
  wins: string;
  losses: string;
  totalGames: string;
  rating: string;
}

export function ProfileTab() {
  const { address } = useAccount();
  const { query } = useSubgraph();
  const [stats, setStats] = useState<PlayerStats | null>(null);

  useEffect(() => {
    if (!address) return;
    const fetchStats = async () => {
      const queryString = `
        query GetPlayerStats($id: ID!) {
          player(id: $id) {
            totalVolume
            netEarnings
            biggestWin
            wins
            losses
            totalGames
            rating
          }
        }
      `;
      const result = await query<{ player: PlayerStats }>(queryString, { id: address.toLowerCase() });
      if (result && result.player) {
        setStats(result.player);
      }
    };
    fetchStats();
  }, [address, query]);

  if (!address) {
    return (
      <div className="text-center py-12 text-gray-400">
        Please connect your wallet to view your profile.
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Rating Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">ELO Rating</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.rating}</p>
        </div>

        {/* Win Rate Card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-green-400">
            <Trophy className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Win Rate</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {parseInt(stats.totalGames) > 0 
              ? `${((parseInt(stats.wins) / parseInt(stats.totalGames)) * 100).toFixed(1)}%` 
              : '0%'}
          </p>
        </div>

        {/* Total Volume */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-purple-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Total Volume</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatEther(BigInt(stats.totalVolume || '0'))} ETH
          </p>
        </div>

        {/* Biggest Win */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-yellow-400">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Biggest Win</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatEther(BigInt(stats.biggestWin || '0'))} ETH
          </p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Financial Overview</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-400">Net Earnings</p>
            <p className={`text-3xl font-bold ${BigInt(stats.netEarnings || '0') >= 0n ? 'text-green-400' : 'text-red-400'}`}>
              {BigInt(stats.netEarnings || '0') >= 0n ? '+' : ''}
              {formatEther(BigInt(stats.netEarnings || '0'))} ETH
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Games Played</p>
            <p className="text-xl font-bold text-white">{stats.totalGames}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
