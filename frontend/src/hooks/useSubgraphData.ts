'use client';

import { useEffect, useState } from 'react';
import { useSubgraph } from './useSubgraph';

export interface SubgraphPlayer {
  id: string;
  username: string;
  address: string;
  rating: string;
  wins: string;
  losses: string;
  draws: string;
  totalGames: string;
}

export interface SubgraphGame {
  id: string;
  gameId: string;
  player1: { id: string; username: string };
  player2?: { id: string; username: string };
  betAmount: string;
  boardSize: number;
  token: string;
  status: string;
  createdAt: string;
  winner?: { id: string; username: string };
}

export function useSubgraphLeaderboard(limit: number = 100) {
  const { query, loading, error } = useSubgraph();
  const [data, setData] = useState<SubgraphPlayer[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const queryString = `
        query GetLeaderboard($limit: Int!) {
          players(orderBy: rating, orderDirection: desc, first: $limit) {
            id
            username
            address
            rating
            wins
            losses
            draws
            totalGames
          }
        }
      `;
      const result = await query<{ players: SubgraphPlayer[] }>(queryString, { limit });
      if (result) setData(result.players);
    };

    fetchLeaderboard();
  }, [query, limit]);

  return { leaderboard: data, isLoading: loading, error };
}

export function useSubgraphActiveGames() {
  const { query, loading, error } = useSubgraph();
  const [data, setData] = useState<SubgraphGame[]>([]);

  useEffect(() => {
    const fetchActiveGames = async () => {
      const queryString = `
        query GetActiveGames {
          games(where: { status: CREATED }, orderBy: createdAt, orderDirection: desc) {
            id
            gameId
            player1 { id username }
            betAmount
            boardSize
            token
            status
            createdAt
          }
        }
      `;
      const result = await query<{ games: SubgraphGame[] }>(queryString);
      if (result) setData(result.games);
    };

    fetchActiveGames();
  }, [query]);

  return { games: data, isLoading: loading, error };
}

export function useSubgraphPendingChallenges(playerAddress: string) {
  const { query, loading, error } = useSubgraph();
  const [data, setData] = useState<SubgraphGame[]>([]);

  useEffect(() => {
    if (!playerAddress) return;
    const fetchChallenges = async () => {
      const queryString = `
        query GetPendingChallenges($player: String!) {
          games(where: { player2: $player, status: CREATED }, orderBy: createdAt, orderDirection: desc) {
            id
            gameId
            player1 { id username }
            player2 { id username }
            betAmount
            boardSize
            token
            status
            createdAt
          }
        }
      `;
      const result = await query<{ games: SubgraphGame[] }>(queryString, { player: playerAddress.toLowerCase() });
      if (result) setData(result.games);
    };

    fetchChallenges();
  }, [query, playerAddress]);

  return { challenges: data, isLoading: loading, error };
}

        }
      `;
      const result = await query<{ games: SubgraphGame[] }>(queryString, { player: playerAddress.toLowerCase() });
      if (result) setData(result.games);
    };

    fetchPlayerGames();
  }, [query, playerAddress]);

  return { games: data, isLoading: loading, error };
}
