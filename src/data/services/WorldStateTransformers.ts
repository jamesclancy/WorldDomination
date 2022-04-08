import { CountryNameKey } from "../models/GameMap";
import { RoundStepType, TerritoryState } from "../models/GameState";
import Player from "../models/Player";
import { addArmiesToTile, executeArmyMovementAgainstTerritoryStates } from "./UserActions";

export type ArmyApplicationSet = {
  playerName: string;
  numberOfArmiesRemaining: number;
};

export interface IWorldMapState {
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
  type:
    | "None"
    | "SelectTile"
    | "TargetTile"
    | "ClearSelection"
    | "LoadInitialState";
  target?: CountryNameKey;
  armiesToApply?: number;
  initialState?: IWorldMapState;
}

export function appendEventToHistory(
  round: number,
  nextEvent: string,
  previousHistory: string
) {
  let date = new Date(Date.now()).toISOString();
  return `${round.toString()}\t${date}\t${nextEvent}\n${previousHistory}`;
}

export function moveToNextTurn(state: IWorldMapState): IWorldMapState {
  if (
    state.roundStepRemainingPlayerTurns &&
    state.roundStepRemainingPlayerTurns.length
  ) {
    const nextPlayer = state.roundStepRemainingPlayerTurns[0];
    const remainingSteps = state.roundStepRemainingPlayerTurns.slice(1);
    return {
      ...state,
      currentTurn: nextPlayer,
      roundStepRemainingPlayerTurns: remainingSteps,
    };
  }

  const newState = state.roundStep === "Movement" ? "AddArmies" : "Movement";

  const newArmyValue: ArmyApplicationSet[] =
    newState === "Movement"
      ? state.currentPlayers.map((x) => {
          return { playerName: x.name, numberOfArmiesRemaining: 100 };
        })
      : state.currentPlayers.map((x) => {
        return { playerName: x.name, numberOfArmiesRemaining: 100 };
      });

  const stepReset = state.currentPlayers.map((x) => x.name);

  const newRoundCounter = state.roundCounter + 1;
  const newCurrentTurn = stepReset[0];
  const newRoundStepRemainingPlayerTurns = stepReset.slice(1);

  return {
    ...state,
    currentTurn: newCurrentTurn,
    roundStep: newState,
    roundStepRemainingPlayerTurns: newRoundStepRemainingPlayerTurns,
    roundCounter: newRoundCounter,
    armiesToApply: newArmyValue,
  };
}

export function worldMapReducer(
  state: IWorldMapState,
  action: IWorldMapAction
) {
  switch (action.type) {
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

      const otherUser =
      state.currentPlayers.find((x) => x.name !== state.currentTurn)
        ?.name ?? state.currentTurn;

      if (state.selectedTerritory === undefined) {
        // add armies
        let remainingArmiesAfterAdd : number = (state.armiesToApply.find(x=>x.playerName === state.currentTurn)?.numberOfArmiesRemaining ?? 0) - action.armiesToApply;

        if(remainingArmiesAfterAdd < 0) {

          return { ...state, history:appendEventToHistory(
            state.roundCounter,
            `${state.currentPlayers} has ${remainingArmiesAfterAdd} armies remaining to apply.`,
            state.history
          )};
        }
        
        let [update, updatedPositions] =
        addArmiesToTile(
          state.currentPositions,
          action.target,
          action.armiesToApply
        );

        let updatedHistory = appendEventToHistory(
          state.roundCounter,
          update,
          state.history
        );
        
        updatedHistory = appendEventToHistory(
          state.roundCounter,
          `${state.currentTurn} has ${remainingArmiesAfterAdd} armies remaining to apply.`,
          updatedHistory
        );

        const remainingArmies = state.armiesToApply.map(x=> x.playerName === state.currentTurn ? {playerName:x.playerName, numberOfArmiesRemaining: remainingArmiesAfterAdd} : x);

        const shouldMoveToNextTurn = (remainingArmiesAfterAdd ===  0);

        const baseStateForReturn =  shouldMoveToNextTurn ? moveToNextTurn(state) : state;

        return {
          ...baseStateForReturn,
          currentPositions: updatedPositions,
          selectedTerritory: undefined,
          history: updatedHistory,
          armiesToApply: remainingArmies
        };
      } else {
        let [update, updatedPositions] =
          executeArmyMovementAgainstTerritoryStates(
            state.currentPositions,
            state.selectedTerritory,
            action.target,
            action.armiesToApply
          );
        let updatedHistory = appendEventToHistory(
          state.roundCounter,
          update,
          state.history
        );
        return {
          ...moveToNextTurn(state),
          currentPositions: updatedPositions,
          selectedTerritory: undefined,
          currentTurn: otherUser,
          history: updatedHistory,
        };
      }
  }
  return state;
}
