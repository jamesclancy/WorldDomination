import {
  Button,
  Classes,
  H6,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  TextArea,
} from "@blueprintjs/core";
import { useContext, useEffect, useReducer } from "react";
import {
  GameContext,
  IGameContext,
  ITileContext,
  WorldMapContext,
} from "../data/models/Contexts";
import { CountryNameKey } from "../data/models/GameMap";
import {
  IWorldMapState,
  worldMapReducer,
} from "../data/services/WorldStateTransformers";
import { NamedTerritoryTile } from "./TerritoryTile";

import WorldMapControlPanel from "./WorldMapControlPanel";

const WorldMap = () => {
  let gameContext = useContext<IGameContext>(GameContext);
  const initialState: IWorldMapState = {
    currentPlayers: gameContext.currentPlayers,
    currentTurn: gameContext.currentPlayers[0].name,
    currentPositions: gameContext.currentPositions,
    selectedTerritory: undefined,
    history: "Game Started",
    roundStep: "Movement",
    roundStepRemainingPlayerTurns: gameContext.currentPlayers.map(
      (x) => x.name
    ).slice(1),
    armiesToApply: [],
    roundCounter: 0,
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
          <div
            className="row"
            style={{
              borderBottom: 3,
              borderBottomStyle: "solid",
              borderBottomColor: "#333",
            }}
          >
            <div className="col-3 col">
              <H6 muted={state.roundStep !== "AddArmies"}>Planning Phase</H6>
              {state.roundStep === "AddArmies" && state.roundStepRemainingPlayerTurns}
            </div>
            <div className="col-3 col">
              <H6 muted={state.roundStep !== "Movement"}>Attack Phase</H6>
              {state.roundStep === "Movement" && state.roundStepRemainingPlayerTurns}
            </div>
          </div>
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
                {gameContext.currentMap.territories.map((x) => (
                  <NamedTerritoryTile name={x.name} />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </WorldMapContext.Provider>
    </>
  );
};

export default WorldMap;
