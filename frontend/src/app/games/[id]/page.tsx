import React from "react";
import GameDetails from "@/components/games/GameDetails";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  const { id } = params;
  return <GameDetails gameId={id} />;
}
