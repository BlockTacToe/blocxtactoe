"use client";

import { Trophy, Medal, Award } from "lucide-react";
import { useSubgraphLeaderboard } from "@/hooks/useSubgraphData";
import { Loader2 } from "lucide-react";

export function LeaderboardContent() {
  const { leaderboard, isLoading, error } = useSubgraphLeaderboard(100);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-2 sm:px-4 py-6 sm:py-8 md:py-12 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">Leaderboard</h1>
            </div>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg">Top players ranked by number of wins</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="text-center py-8 sm:py-12">
              <p className="text-yellow-400 mb-2 sm:mb-4 text-sm sm:text-base">Unable to load leaderboard</p>
              <p className="text-gray-400 text-xs sm:text-sm mb-4">This may be due to network issues or the leaderboard being empty.</p>
              <p className="text-gray-500 text-xs sm:text-sm">Please try refreshing the page or check back later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-4 py-6 sm:py-8 md:py-12 lg:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">Leaderboard</h1>
          </div>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg">Top players ranked by number of wins</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10 p-3 sm:p-4 md:p-6 lg:p-8">
          {!leaderboard || leaderboard.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-400 text-sm sm:text-base">No players on the leaderboard yet.</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">Be the first to play and win!</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {leaderboard.map((player, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2 sm:p-3 md:p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/20 flex-shrink-0">
                        {rank === 1 && <Medal className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400" />}
                        {rank === 2 && <Medal className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-300" />}
                        {rank === 3 && <Medal className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-400" />}
                        {rank > 3 && <span className="text-white font-bold text-xs sm:text-sm md:text-base">{rank}</span>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-medium text-sm sm:text-base truncate">
                          {player.username || `${player.address.slice(0, 6)}...${player.address.slice(-4)}`}
                        </p>
                        <p className="text-gray-400 text-xs sm:text-sm font-mono truncate">
                          {player.address.slice(0, 10)}...{player.address.slice(-8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <Award className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                          <span className="text-white font-bold text-sm sm:text-base">{player.rating}</span>
                        </div>
                        <span className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider font-bold">Rating</span>
                      </div>
                      <div className="flex flex-col items-end min-w-[60px]">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                          <span className="text-white font-bold text-sm sm:text-base">{player.wins}</span>
                        </div>
                        <span className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-wider font-bold">Wins</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

