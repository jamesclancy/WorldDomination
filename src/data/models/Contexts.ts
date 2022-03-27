import React from "react";
import { constructEmptyWorldMapContext, constructInitialGameContext } from "../services/WorldBuilder";
import GameMap, { CountryNameKey } from "./GameMap";
import { TerritoryState } from "./GameState";
import Player from "./Player";

export const GameContext = React.createContext<IGameContext>(constructInitialGameContext())
export const WorldMapContext = React.createContext<ITileContext>(constructEmptyWorldMapContext());

export interface IGameContext 
{
    currentMap: GameMap
    currentPlayers: [Player, Player]
    currentPositions: TerritoryState[]
    currentTurn: string
    selectedTerritory: CountryNameKey | undefined
}

export interface ITileContext extends IGameContext {
    applyArmies(territoryName: CountryNameKey,selectedArmies: number): void;
    onClick(territoryName: CountryNameKey): void
}