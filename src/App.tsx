import React, { useContext, useReducer } from 'react';
import './App.css';
import WorldMap from './components/WorldMap';
import TerritorySelect from './components/TerritorySelector';
import { TerritoryState } from './data/models/GameState';
import Player from './data/models/Player';
import { GameContext, IGameContext } from './data/models/Contexts';

function App() {

  let gameContext = useContext<IGameContext>(GameContext);

  const initialState: IAppState = {
    currentPage: 'TerritorySelect',
    startingPositions: [],
    players: gameContext.currentPlayers
  };

  let [state, dispatch] = useReducer(appStateReducer, initialState)

  let startGame = (territories: TerritoryState[], players: [Player, Player]) => {
    dispatch({type:'PositionsSelected', startingPositions: territories, players: players});
  };

  return (
    <div className="App">
      <main className="Main p-5">
        <div className="container-fluid">
          <div className="row">
            <div hidden={state.currentPage !== "TerritorySelect"}>
              <TerritorySelect Territories={gameContext.currentMap.territories} onStartGame={startGame} />
            </div>
            <div hidden={state.currentPage !== "WorldMap"}>
              <GameContext.Provider value={{ ...gameContext, currentPositions: state.startingPositions, currentPlayers: state.players }}>
                <WorldMap />
              </GameContext.Provider>
            </div>
          </div>
        </div></main>
    </div>
  );
}

interface IAppState {
  currentPage: 'TerritorySelect' | 'WorldMap',
  startingPositions: TerritoryState[],
  players: [Player, Player]
}

interface IAppStateAction {
  type: 'None' | 'PositionsSelected',
  startingPositions?: TerritoryState[],
  players?: [Player, Player]
}

const appStateReducer = (state: IAppState, action: IAppStateAction) => {
  if (action.type === "PositionsSelected"
    && action.players !== undefined
    && action.startingPositions !== undefined) {
      const newState : IAppState = { currentPage: 'WorldMap', startingPositions: action.startingPositions, players: action.players };
      return  newState;
  }
  return state;
};

export default App;
