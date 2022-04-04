import {
  Button,
  Card,
  Classes,
  H1,
  HTMLTable,
  Menu,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  TextArea,
} from "@blueprintjs/core";
import { useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import {
  GameContext,
  IGameContext,
  ITileContext,
  WorldMapContext,
} from "../data/models/Contexts";
import { CountryNameKey } from "../data/models/GameMap";
import { TerritoryState } from "../data/models/GameState";
import Player from "../data/models/Player";
import { rollBattleDice } from "../utilities/Randomization";
import { NamedTerritoryTile } from "./TerritoryTile";

import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  Annotation,
} from "react-simple-maps";
import WorldMapControlPanel from "./WorldMapControlPanel";

const WorldMap = () => {
  let gameContext = useContext<IGameContext>(GameContext);

  const initialState: IWorldMapState = {
    currentPlayers: gameContext.currentPlayers,
    currentTurn: gameContext.currentPlayers[0].name,
    currentPositions: gameContext.currentPositions,
    selectedTerritory: undefined,
    history: "Game Started",
  };

  let [state, dispatch] = useReducer(worldMapReducer, initialState);

  useEffect(() => {
    dispatch({ type: "LoadInitialState", initialState: initialState });
  }, [gameContext]);

  let applyArmies = (name: CountryNameKey, selectedArmies: number) => {
    dispatch({
      type: "TargetTile",
      armiesToApply: selectedArmies,
      target: name,
    });
  };

  let trySelectTerritory = (name: CountryNameKey) => {
    dispatch({ type: "SelectTile", target: name });
  };

  let propsToAddToEachTile: ITileContext = {
    ...gameContext,
    currentPositions: state.currentPositions,
    currentTurn: state.currentTurn,
    selectedTerritory: state.selectedTerritory,
    onClick: trySelectTerritory,
    applyArmies: applyArmies,
  };

  let clearSelectedTerritory = () => {
    dispatch({ type: "ClearSelection" });
  };

  return (
    <>
      <Navbar fixedToTop={true}>
        <NavbarGroup align="right">
          <NavbarHeading>World Domination</NavbarHeading>
          <NavbarDivider />
          <Button className={Classes.MINIMAL} icon="home" text="Home" />
          <Button className={Classes.MINIMAL} icon="log-in" text="Account" />
        </NavbarGroup>
      </Navbar>
      <WorldMapContext.Provider value={propsToAddToEachTile}>
        <div className="fx-grd bottomControlPanel">
          <div className="row">
            <div
              className="col-2 col"
              style={{
                borderRight: 3,
                borderRightStyle: "solid",
                borderRightColor: "#333",
              }}
            >
              <WorldMapControlPanel
                selectedTerritory={state.selectedTerritory}
                clearSelectedTerritory={clearSelectedTerritory}
              />
            </div>
            <div className="col-5 col">
              <h5>Event Log</h5>
              <TextArea value={state.history}></TextArea>
            </div>
          </div>
        </div>
        <div className="fx-grd gamePanel">
          <div className="row">
            <div className="col-7 col">
              <svg viewBox="0 40 210 160">
                <NamedTerritoryTile name="Alaska" />
                <NamedTerritoryTile name="NorthWesternTerritory" />
                <NamedTerritoryTile name="Greenland" />
                <NamedTerritoryTile name="Scandinavia" />
                <NamedTerritoryTile name="Ukraine" />
                <NamedTerritoryTile name="Ural" />
                <NamedTerritoryTile name="Siberia" />
                <NamedTerritoryTile name="Yakutsk" />
                <NamedTerritoryTile name="Kamchatka" />
                <NamedTerritoryTile name="Alberta" />
                <NamedTerritoryTile name="Ontario" />
                <NamedTerritoryTile name="Quebec" />
                <NamedTerritoryTile name="Iceland" />
                <NamedTerritoryTile name="NorthernEurope" />
                <NamedTerritoryTile name="Afghanistan" />
                <NamedTerritoryTile name="Irkutsk" />
                <NamedTerritoryTile name="Japan" />
                <NamedTerritoryTile name="WesternUS" />
                <NamedTerritoryTile name="EasternUS" />
                <NamedTerritoryTile name="GreatBritain" />
                <NamedTerritoryTile name="Mongolia" />
                <NamedTerritoryTile name="China" />
                <NamedTerritoryTile name="CentralAmerica" />
                <NamedTerritoryTile name="WesternEurope" />
                <NamedTerritoryTile name="SouthernEurope" />
                <NamedTerritoryTile name="MiddleEast" />
                <NamedTerritoryTile name="Hindustan" />
                <NamedTerritoryTile name="Siam" />
                <NamedTerritoryTile name="Venezuela" />
                <NamedTerritoryTile name="NorthAfrica" />
                <NamedTerritoryTile name="Egypt" />
                <NamedTerritoryTile name="Indonesia" />
                <NamedTerritoryTile name="NewGuinea" />
                <NamedTerritoryTile name="Peru" />
                <NamedTerritoryTile name="Brazil" />
                <NamedTerritoryTile name="Congo" />
                <NamedTerritoryTile name="EastAfrica" />
                <NamedTerritoryTile name="WesternAustralia" />
                <NamedTerritoryTile name="EasternAustralia" />
                <NamedTerritoryTile name="Argentina" />
                <NamedTerritoryTile name="SouthAfrica" />
                <NamedTerritoryTile name="Madagascar" />
              </svg>
            </div>
          </div>
        </div>
      </WorldMapContext.Provider>
    </>
  );
};

interface IWorldMapState {
  currentPlayers: [Player, Player];
  currentTurn: string;
  currentPositions: TerritoryState[];
  selectedTerritory: CountryNameKey | undefined;
  history: string;
}

interface IWorldMapAction {
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

function executeMovement(
  currentPositions: TerritoryState[],
  selectedTerritory: CountryNameKey,
  targetTerritory: CountryNameKey,
  selectedArmies: number
): [string, TerritoryState[]] {
  let positions = currentPositions;

  let selectedTerritoryState = positions.find(
    (x) => x.territoryName === selectedTerritory
  );
  let targetTerritoryState = positions.find(
    (x) => x.territoryName === targetTerritory
  );

  let updatedSelectedTerritoryState;
  let updatedTargetTerritoryState;

  let whatHappened = "";

  if (
    selectedTerritoryState === undefined ||
    targetTerritoryState === undefined
  )
    return [whatHappened, positions];

  if (selectedTerritoryState.playerName === targetTerritoryState.playerName) {
    // If the tile has the same owner just move the armies.
    updatedSelectedTerritoryState = {
      ...selectedTerritoryState,
      armies: selectedTerritoryState.armies - selectedArmies,
    };
    updatedTargetTerritoryState = {
      ...targetTerritoryState,
      armies: targetTerritoryState.armies + selectedArmies,
    };

    whatHappened = `${updatedSelectedTerritoryState.playerName} is moving ${selectedArmies} armies from ${selectedTerritory} to ${targetTerritory}.`;
  } else {
    // If the tiles have different owners it is an attack.
    let [survivingAttackers, survivingDefenders] = rollBattleDice(
      selectedArmies,
      targetTerritoryState.armies
    );

    if (survivingDefenders === 0) {
      updatedSelectedTerritoryState = {
        ...selectedTerritoryState,
        armies: selectedTerritoryState.armies - selectedArmies,
      };
      updatedTargetTerritoryState = {
        ...targetTerritoryState,
        armies: survivingAttackers,
        playerName: selectedTerritoryState.playerName,
      };
    } else {
      updatedSelectedTerritoryState = {
        ...selectedTerritoryState,
        armies:
          selectedTerritoryState.armies - (selectedArmies - survivingAttackers),
      };
      updatedTargetTerritoryState = {
        ...targetTerritoryState,
        armies: survivingDefenders,
      };
    }

    whatHappened = `${
      updatedSelectedTerritoryState.playerName
    } is attacking with ${selectedArmies} armies from ${selectedTerritory} to ${targetTerritory}.
                         - ${
                           survivingDefenders === 0
                             ? selectedTerritoryState.playerName
                             : targetTerritoryState.playerName
                         } won.
                         - survivingAttackers: ${survivingAttackers}, survivingDefenders: ${survivingDefenders}`;
  }

  let updatedPositions = positions.filter(
    (x) =>
      x.territoryName !== targetTerritory &&
      x.territoryName !== selectedTerritory
  );
  updatedPositions.push(updatedSelectedTerritoryState);
  updatedPositions.push(updatedTargetTerritoryState);

  return [whatHappened, updatedPositions];
}

let appendEventToHistory = (nextEvent: string, previousHistory: string) => {
  let date = new Date(Date.now()).toISOString();
  return `${date} - ${nextEvent}
${previousHistory}`;
};

let worldMapReducer = (state: IWorldMapState, action: IWorldMapAction) => {
  console.log(action);
  switch (action.type) {
    case "LoadInitialState":
      if (action.initialState) return action.initialState;
      break;
    case "ClearSelection":
      let newHistory = appendEventToHistory(
        `${state.currentTurn} - Cleared Selection`,
        state.history
      );
      return { ...state, history: newHistory, selectedTerritory: undefined };
    case "SelectTile":
      if (!state.selectedTerritory && action.target) {
        let newHistory = appendEventToHistory(
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
      if (!state.selectedTerritory || !action.armiesToApply || !action.target)
        return state;

      let otherUser =
        state.currentPlayers.find((x) => x.name !== state.currentTurn)?.name ??
        state.currentTurn;
      let [update, updatedPositions] = executeMovement(
        state.currentPositions,
        state.selectedTerritory,
        action.target,
        action.armiesToApply
      );
      let updatedHistory = appendEventToHistory(update, state.history);
      return {
        ...state,
        currentPositions: updatedPositions,
        selectedTerritory: undefined,
        currentTurn: otherUser,
        history: updatedHistory,
      };
  }
  return state;
};

export default WorldMap;
