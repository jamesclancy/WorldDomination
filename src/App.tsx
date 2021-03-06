import React, { useContext, useEffect, useReducer } from "react";
import "./App.css";
import WorldMap from "./components/WorldMap";
import TerritorySelect from "./components/TerritorySelector";
import { TerritoryState } from "./data/models/GameState";
import Player from "./data/models/Player";
import { GameContext, IGameContext } from "./data/models/Contexts";
import { Intent, Spinner } from "@blueprintjs/core";
import { constructInitialGameContext } from "./data/services/WorldBuilder";

function App() {
  let gameContext = useContext<IGameContext>(GameContext);

  const initialState: IAppState = {
    currentPage: "Loading",
    startingPositions: [],
    players: gameContext.currentPlayers,
    currentContext: gameContext,
  };

  let [state, dispatch] = useReducer(appStateReducer, initialState);

  const loadMapData = async () => {
    const mapData = await constructInitialGameContext();
    dispatch({ type: "MapDataLoaded", newContext: mapData });
  };

  useEffect(() => {
    loadMapData();
  }, []);

  let startGame = (territories: TerritoryState[], players: [Player, Player]) => {
    dispatch({
      type: "PositionsSelected",
      startingPositions: territories,
      players: players,
    });
  };

  let switchPageToDisplay = (state: IAppState) => {
    switch (state.currentPage) {
      case "Loading":
        return (
          <>
            <br />
            <br />
            <Spinner size={300} intent={Intent.WARNING}></Spinner>
          </>
        );
      case "TerritorySelect":
        return <TerritorySelect Territories={state.currentContext.currentMap.territories} onStartGame={startGame} />;
      case "WorldMap":
        return <WorldMap />;
    }
  };

  return (
    <div className="App">
      <main className="Main p-5">
        <div className="container-fluid">
          <div className="row">
            <GameContext.Provider
              value={{
                ...state.currentContext,
                currentPositions: state.startingPositions,
                currentPlayers: state.players,
              }}
            >
              {switchPageToDisplay(state)}
            </GameContext.Provider>
          </div>
        </div>
      </main>
    </div>
  );
}

interface IAppState {
  currentPage: "TerritorySelect" | "WorldMap" | "Loading";
  startingPositions: TerritoryState[];
  players: [Player, Player];
  currentContext: IGameContext;
}

interface IAppStateAction {
  type: "None" | "PositionsSelected" | "MapDataLoaded";
  startingPositions?: TerritoryState[];
  players?: [Player, Player];
  newContext?: IGameContext;
}

const appStateReducer = (state: IAppState, action: IAppStateAction) => {
  if (action.type === "PositionsSelected" && action.players !== undefined && action.startingPositions !== undefined) {
    const newState: IAppState = {
      currentPage: "WorldMap",
      startingPositions: action.startingPositions,
      players: action.players,
      currentContext: state.currentContext,
    };
    return newState;
  }
  if (action.type === "MapDataLoaded" && action.newContext !== undefined) {
    const newState: IAppState = {
      currentPage: "TerritorySelect",
      startingPositions: state.startingPositions,
      players: state.players,
      currentContext: action.newContext,
    };
    return newState;
  }
  return state;
};

export default App;
