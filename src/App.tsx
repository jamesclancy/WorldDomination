import React, { useContext, useState } from 'react';
import './App.css';
import WorldMap from './components/WorldMap';
import TerritorySelect from './components/TerritorySelector';
import { TerritoryState } from './data/models/GameState';
import Player from './data/models/Player';
import { GameContext, IGameContext } from './data/models/Contexts';

function App() {

  let gameContext = useContext<IGameContext>(GameContext);
  let [currentPage, setCurrentPage] = useState("TerritorySelect");
  let [startingPositions, setStartingPositions] = useState<TerritoryState[]>([]);
  let [players, setPlayers] = useState<[Player, Player]>(gameContext.currentPlayers);

  let startGame = (territories: TerritoryState[], players: [Player, Player]) => {
    setStartingPositions(territories);
    setPlayers(players);
    setCurrentPage("WorldMap");
  };

  return (
    <div className="App">
      <main className="Main p-5">
        <div className="container-fluid">
          <div className="row">
      <div hidden={currentPage !== "TerritorySelect"}>
        <TerritorySelect Territories={gameContext.currentMap.territories} onStartGame={startGame} />
      </div>
      <div hidden={currentPage !== "WorldMap"}>
        <GameContext.Provider value={ {...gameContext, currentPositions: startingPositions, currentPlayers: players }}>
          <WorldMap />
        </GameContext.Provider>
      </div>
    </div>
    </div></main>
    </div>
  );
}

export default App;
