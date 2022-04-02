import React from "react";
import { constructEmptyWorldMapContext, constructInitialGameContext } from "../services/WorldBuilder";
import GameMap, { CountryNameKey } from "./GameMap";
import { TerritoryState } from "./GameState";
import Player from "./Player";


const emptyContext: IGameContext = {
    currentMap: { continents: [], territories: [], territoryBridges: [], territoryPathDefinitions:[] },
    currentPlayers: [{ name: "Player 1", displayName: 'Player 1' }, { name: "Player 2", displayName: 'Player 2' }],
    currentPositions: [],
    currentTurn: 'Player 1',
    selectedTerritory: undefined
};

const emptyMapContext: ITileContext = {
    currentMap: { continents: [], territories: [], territoryBridges: [], territoryPathDefinitions:[] },
    currentPlayers: [{ name: "Player 1", displayName: 'Player 1' }, { name: "Player 2", displayName: 'Player 2' }],
    currentPositions: [],
    currentTurn: 'Player 1',
    selectedTerritory: undefined,
    applyArmies: (x, y) => { },
    onClick: (x) => { }
};

export const GameContext = React.createContext<IGameContext>(emptyContext)
export const WorldMapContext = React.createContext<ITileContext>(emptyMapContext);

export interface IGameContext {
    currentMap: GameMap
    currentPlayers: [Player, Player]
    currentPositions: TerritoryState[]
    currentTurn: string
    selectedTerritory: CountryNameKey | undefined
}

export interface ITileContext extends IGameContext {
    applyArmies(territoryName: CountryNameKey, selectedArmies: number): void;
    onClick(territoryName: CountryNameKey): void
}