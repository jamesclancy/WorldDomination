import GameMap, { CountryNameKey } from "../models/GameMap";
import { RoundStepType, TerritoryState } from "../models/GameState";
import Player from "../models/Player";
import { getCountryForTerritory as getContinentForTerritory } from "../models/Selectors";
import { addArmiesToTile, executeArmyMovementAgainstTerritoryStates } from "./UserActions";

export type ArmyApplicationSet = {
  playerName: string;
  numberOfArmiesRemaining: number;
};

export interface IWorldMapState {
  currentMap: GameMap;
  currentPlayers: [Player, Player];
  currentTurn: string;
  currentPositions: TerritoryState[];
  selectedTerritory: CountryNameKey | undefined;
  history: string;
  roundStep: RoundStepType;
  roundStepRemainingPlayerTurns: string[];
  armiesToApply: ArmyApplicationSet[];
  roundCounter: number;
}

export interface IWorldMapAction {
  type: "None" | "SelectTile" | "TargetTile" | "ClearSelection" | "LoadInitialState" | "MoveToNextStep";
  target?: CountryNameKey;
  armiesToApply?: number;
  initialState?: IWorldMapState;
}

export function worldMapReducer(state: IWorldMapState, action: IWorldMapAction) {
  switch (action.type) {
    case "MoveToNextStep":
      return moveToNextTurn(state);
    case "LoadInitialState":
      if (action.initialState) return action.initialState;
      break;
    case "ClearSelection":
      let newHistory = appendEventToHistory(
        state.roundCounter,
        `${state.currentTurn} - Cleared Selection`,
        state.history
      );
      return { ...state, history: newHistory, selectedTerritory: undefined };
    case "SelectTile":
      if (!state.selectedTerritory && action.target) {
        let newHistory = appendEventToHistory(
          state.roundCounter,
          `${state.currentTurn} - Selected ${action.target}`,
          state.history
        );
        return {
          ...state,
          history: newHistory,
          selectedTerritory: action.target,
        };
      }
      return state;
    case "TargetTile":
      if (!action.armiesToApply || !action.target) return state;
      if (state.selectedTerritory === undefined) return performAddArmies(state, action.target, action.armiesToApply);

      return performAttackOrMove(state, state.selectedTerritory, action.target, action.armiesToApply);
  }
  return state;
}

function appendEventToHistory(round: number, nextEvent: string, previousHistory: string) {
  let date = new Date(Date.now()).toISOString();
  return `${round.toString()}\t${date}\t${nextEvent}\n${previousHistory}`;
}

function moveToNextTurn(state: IWorldMapState): IWorldMapState {
  if (state.roundStepRemainingPlayerTurns && state.roundStepRemainingPlayerTurns.length) {
    const nextPlayer = state.roundStepRemainingPlayerTurns[0];
    const remainingSteps = state.roundStepRemainingPlayerTurns.slice(1);
    return {
      ...state,
      currentTurn: nextPlayer,
      roundStepRemainingPlayerTurns: remainingSteps,
    };
  }

  const newStep =
    state.roundStep === "Movement" ? "AddArmies" : state.roundStep === "AddArmies" ? "Attack" : "Movement";
  const newArmyValue: ArmyApplicationSet[] = calculateNewArmiesToAdd(newStep, state);
  const stepReset = state.currentPlayers.map((x) => x.name);
  const newRoundCounter = state.roundCounter + 1;
  const newCurrentTurn = stepReset[0];
  const newRoundStepRemainingPlayerTurns = stepReset.slice(1);

  return {
    ...state,
    currentTurn: newCurrentTurn,
    roundStep: newStep,
    roundStepRemainingPlayerTurns: newRoundStepRemainingPlayerTurns,
    roundCounter: newRoundCounter,
    armiesToApply: newArmyValue,
  };
}

function calculateNewArmiesToAdd(newStep: string, state: IWorldMapState): ArmyApplicationSet[] {
  if (newStep === "AddArmies") {
    const numberOfTerritoriesControlled = calculatePlayerControlledTerritoryCountBonus(state);
    const continentOwners = calculateContinentOwnershipBonuses(state);

    return state.currentPlayers.map((x) => {
      const cBonus = continentOwners.find((y) => y.playerName === x.name)?.armiesToAdd ?? 0;
      const tBonus = numberOfTerritoriesControlled.find((y) => y.playerName === x.name)?.armiesToAdd ?? 0;
      const previousValue = state.armiesToApply.find((y) => y.playerName === x.name)?.numberOfArmiesRemaining ?? 0;

      return {
        playerName: x.name,
        numberOfArmiesRemaining: cBonus + tBonus + previousValue,
      };
    });
  }

  return state.armiesToApply;
}

function calculateContinentOwnershipBonuses(state: IWorldMapState) {
  return Array.from(
    state.currentPositions
      .map((x) => {
        return {
          playerName: x.playerName,
          continent: getContinentForTerritory(state.currentMap, x.territoryName),
        };
      })
      .reduce((previousValue, newValue) => {
        if (newValue && previousValue && newValue.continent && newValue.playerName) {
          let prevValue = previousValue.get(newValue.continent.name) ?? [];
          if (prevValue.find((x) => x === newValue.playerName) === undefined) {
            prevValue.push(newValue.playerName);
          }
          previousValue.set(newValue.continent.name, prevValue);
          return previousValue;
        }
        return previousValue;
      }, new Map<string, string[]>())
      .entries()
  )
    .filter((x) => x[1].length === 1)
    .map((x) => {
      const continentValue = state.currentMap.continents.find((y) => y.name === x[0])?.bonusValue ?? 0;
      return { playerName: x[1][0], armiesToAdd: continentValue };
    });
}

function calculatePlayerControlledTerritoryCountBonus(state: IWorldMapState) {
  return Array.from(
    state.currentPositions
      .map((x) => x.playerName)
      .reduce((previousValue, newValue) => {
        if (newValue && previousValue) {
          previousValue.set(newValue, (previousValue.get(newValue) ?? 0) + 1);
          return previousValue;
        }
        return previousValue;
      }, new Map<string, number>())
      .entries()
  ).map((x) => {
    const territoryValueBonus = Math.floor(x[1] / 3);
    return { playerName: x[0], armiesToAdd: territoryValueBonus };
  });
}

function performAttackOrMove(
  state: IWorldMapState,
  selectedTerritory: CountryNameKey,
  target: CountryNameKey,
  armiesToApply: number
) {
  let [update, updatedPositions] = executeArmyMovementAgainstTerritoryStates(
    state.currentPositions,
    selectedTerritory,
    target,
    armiesToApply
  );
  let updatedHistory = appendEventToHistory(state.roundCounter, update, state.history);
  const baseState = state.roundStep === "Movement" ? moveToNextTurn(state) : state;
  return {
    ...baseState,
    currentPositions: updatedPositions,
    selectedTerritory: undefined,
    history: updatedHistory,
  };
}

function performAddArmies(state: IWorldMapState, target: CountryNameKey, armiesToApply: number): IWorldMapState {
  let remainingArmiesAfterAdd: number =
    (state.armiesToApply.find((x) => x.playerName === state.currentTurn)?.numberOfArmiesRemaining ?? 0) - armiesToApply;

  if (remainingArmiesAfterAdd < 0) {
    return {
      ...state,
      history: appendEventToHistory(
        state.roundCounter,
        `${state.currentPlayers} has ${remainingArmiesAfterAdd} armies remaining to apply.`,
        state.history
      ),
    };
  }

  let [update, updatedPositions] = addArmiesToTile(state.currentPositions, target, armiesToApply);

  let updatedHistory = appendEventToHistory(state.roundCounter, update, state.history);

  updatedHistory = appendEventToHistory(
    state.roundCounter,
    `${state.currentTurn} has ${remainingArmiesAfterAdd} armies remaining to apply.`,
    updatedHistory
  );

  const remainingArmies = state.armiesToApply.map((x) =>
    x.playerName === state.currentTurn
      ? {
          playerName: x.playerName,
          numberOfArmiesRemaining: remainingArmiesAfterAdd,
        }
      : x
  );

  const shouldMoveToNextTurn = remainingArmiesAfterAdd === 0;

  const baseStateForReturn = shouldMoveToNextTurn ? moveToNextTurn(state) : state;

  return {
    ...baseStateForReturn,
    currentPositions: updatedPositions,
    selectedTerritory: undefined,
    history: updatedHistory,
    armiesToApply: remainingArmies,
  };
}
