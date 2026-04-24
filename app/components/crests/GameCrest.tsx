import type { GameKey } from "~/domain/game-catalog";
import { SkullKingCrest } from "./SkullKingCrest";
import { KingsCribbageCrest } from "./KingsCribbageCrest";
import { BattleshipCrest } from "./BattleshipCrest";
import { GameOfThingsCrest } from "./GameOfThingsCrest";
import { ScoreboardCrest } from "./ScoreboardCrest";

interface GameCrestProps {
  id: GameKey;
  size: number;
}

export function GameCrest({ id, size }: GameCrestProps) {
  if (id === "skull-king") return <SkullKingCrest size={size} />;
  if (id === "kings-cribbage") return <KingsCribbageCrest size={size} />;
  if (id === "battleship") return <BattleshipCrest size={size} />;
  if (id === "game-of-things") return <GameOfThingsCrest size={size} />;
  if (id === "scoreboard") return <ScoreboardCrest size={size} />;
  return null;
}
