import { IGameContext, ITileContext } from "../models/Contexts";
import GameMap, { Continent, Territory, TerritoryBridge } from "../models/GameMap";
import { GameState } from "../models/GameState";
import Player from "../models/Player";

export interface IConstructNewGameDependencies {
}

export function constructEmptyWorldMapContext() : ITileContext {
    let gameContext = constructInitialGameContext();
    let context : ITileContext = 
    {
        ...gameContext,
        onClick: (x) => {}    ,
        applyArmies: (x, y) => {}
    };
    return context;
}

export function constructInitialGameContext() : IGameContext {
    var newGame = constructNewGame({});
    let context : IGameContext=  
    {
        currentMap: newGame.currentMap,
        currentPlayers: newGame.currentPlayers,
        currentPositions: [],
        currentTurn: newGame.currentPlayers[0].name,
        selectedTerritory: undefined,
    };

    return context;
}

function constructNewGame(
    args: IConstructNewGameDependencies
    ): GameState {
    const continents: Continent[] = [
        { name: 'NorthAmerica', displayName: 'North America', },
        { name: 'SouthAmerica', displayName: 'South America' },
        { name: 'Europe', displayName: 'Europe' },
        { name: 'Asia', displayName: 'Asia' },
        { name: 'Africa', displayName: 'Africa' },
        { name: 'Oceania', displayName: 'Oceania' }
    ];
    const territories: Territory[] = [
        { continentName: 'NorthAmerica', name: 'Alaska', displayText: 'Alaska', value: 1 },
        { continentName: 'NorthAmerica', name: 'NorthWesternTerritory', displayText: 'NorthWesternTerritory', value: 6 },
        { continentName: 'NorthAmerica', name: 'Alberta', displayText: 'Alberta', value: 2 },
        { continentName: 'NorthAmerica', name: 'Ontario', displayText: 'Ontario', value: 7 },
        { continentName: 'NorthAmerica', name: 'Quebec', displayText: 'Quebec', value: 8 },
        { continentName: 'NorthAmerica', name: 'WesternUS', displayText: 'Western US', value: 9 },
        { continentName: 'NorthAmerica', name: 'EasternUS', displayText: 'Eastern US', value: 4 },
        { continentName: 'NorthAmerica', name: 'CentralAmerica', displayText: 'Central America', value: 3 },
        { continentName: 'NorthAmerica', name: 'Greenland', displayText: 'Greenland', value: 5 },

        { continentName: 'SouthAmerica', name: 'Venezuela', displayText: 'Venezuela', value: 3 },
        { continentName: 'SouthAmerica', name: 'Brazil', displayText: 'Brazil', value: 2 },
        { continentName: 'SouthAmerica', name: 'Peru', displayText: 'Peru', value: 4 },
        { continentName: 'SouthAmerica', name: 'Argentina', displayText: 'Argentina', value: 1 },

        { continentName: 'Europe', name: 'Iceland', displayText: 'Iceland', value: 2 },
        { continentName: 'Europe', name: 'GreatBritain', displayText: 'Great Britain', value: 1 },
        { continentName: 'Europe', name: 'WesternEurope', displayText: 'Western Europe', value: 7 },
        { continentName: 'Europe', name: 'Scandinavia', displayText: 'Scandinavia', value: 4 },
        { continentName: 'Europe', name: 'NorthernEurope', displayText: 'Northern Europe', value: 3 },
        { continentName: 'Europe', name: 'SouthernEurope', displayText: 'Southern Europe', value: 5 },
        { continentName: 'Europe', name: 'Ukraine', displayText: 'Ukraine', value: 6 },

        { continentName: 'Africa', name: 'NorthAfrica', displayText: 'North Africa', value: 5 },
        { continentName: 'Africa', name: 'Egypt', displayText: 'Egypt', value: 3 },
        { continentName: 'Africa', name: 'EastAfrica', displayText: 'East Africa', value: 2 },
        { continentName: 'Africa', name: 'Congo', displayText: 'Congo', value: 1 },
        { continentName: 'Africa', name: 'SouthAfrica', displayText: 'South Africa', value: 6 },
        { continentName: 'Africa', name: 'Madagascar', displayText: 'Madagascar', value: 4 },

        { continentName: 'Asia', name: 'Afghanistan', displayText: 'Afghanistan', value: 1 },
        { continentName: 'Asia', name: 'China', displayText: 'China', value: 2 },
        { continentName: 'Asia', name: 'Hindustan', displayText: 'Hindustan', value: 3 },
        { continentName: 'Asia', name: 'Irkutsk', displayText: 'Irkutsk', value: 4 },
        { continentName: 'Asia', name: 'Japan', displayText: 'Japan', value: 5 },
        { continentName: 'Asia', name: 'Kamchatka', displayText: 'Kamchatka', value: 6 },
        { continentName: 'Asia', name: 'MiddleEast', displayText: 'MiddleEast', value: 7 },
        { continentName: 'Asia', name: 'Mongolia', displayText: 'Mongolia', value: 8 },
        { continentName: 'Asia', name: 'Siam', displayText: 'Siam', value: 9 },
        { continentName: 'Asia', name: 'Siberia', displayText: 'Siberia', value: 10 },
        { continentName: 'Asia', name: 'Ural', displayText: 'Ural', value: 11 },
        { continentName: 'Asia', name: 'Yakutsk', displayText: 'Yakutsk', value: 12 },

        { continentName: 'Oceania', name: 'Indonesia', displayText: 'Indonesia', value: 3 },
        { continentName: 'Oceania', name: 'NewGuinea', displayText: 'New Guinea', value: 2 },
        { continentName: 'Oceania', name: 'WesternAustralia', displayText: 'Western Australia', value: 4 },
        { continentName: 'Oceania', name: 'EasternAustralia', displayText: 'Eastern Australia', value: 1 },
    ];

    const territoryBridges: TerritoryBridge[] = [
            ['Alaska', 'NorthWesternTerritory' ],
            ['Alaska', 'Alberta' ],

            ['NorthWesternTerritory', 'Greenland' ],
            ['NorthWesternTerritory', 'Alberta' ],
            ['NorthWesternTerritory', 'Ontario' ],

            ['Greenland', 'NorthWesternTerritory' ],
            ['Greenland', 'Ontario' ],
            ['Greenland', 'Quebec' ],
            ['Greenland', 'Iceland' ],

            ['Quebec', 'Greenland' ],
            ['Quebec', 'EasternUS' ],
            ['Quebec', 'Ontario' ],

            ['EasternUS', 'Quebec' ],
            ['EasternUS', 'Ontario' ],
            ['EasternUS', 'WesternUS' ],
            ['EasternUS', 'CentralAmerica' ],

            ['CentralAmerica', 'EasternUS' ],
            ['CentralAmerica', 'WesternUS' ],
            ['CentralAmerica', 'Venezuela' ],

            ['WesternUS', 'EasternUS' ],
            ['WesternUS', 'CentralAmerica' ],
            ['WesternUS', 'Ontario' ],
            ['WesternUS', 'Alberta' ],
            
            ['Alberta', 'Alaska' ],
            ['Alberta', 'NorthWesternTerritory' ],
            ['Alberta', 'Ontario' ],
            ['Alberta', 'WesternUS' ],

            ['Ontario', 'NorthWesternTerritory' ],
            ['Ontario', 'Greenland', ],
            ['Ontario', 'Quebec'],
            ['Ontario', 'EasternUS'],
            ['Ontario', 'WesternUS'],
            ['Ontario', 'Alberta'],

            ['Venezuela', 'CentralAmerica'],
            ['Venezuela', 'Brazil'],
            ['Venezuela', 'Peru'],

            ['Brazil', 'Venezuela'],
            ['Brazil', "NorthAfrica"],
            ['Brazil', 'Argentina'],
            ['Brazil', 'Peru'],

            ['Argentina', 'Brazil'],
            ['Argentina', 'Peru'],

            ['Peru', 'Venezuela'],
            ['Peru', 'Brazil'],
            ['Peru', 'Argentina'],

            ['Iceland', 'Greenland'],
            ['Iceland', 'Scandinavia'],
            ['Iceland', 'GreatBritain'],
            
            ['Scandinavia', 'Ukraine'],
            ['Scandinavia', 'NorthernEurope'],
            ['Scandinavia', 'GreatBritain'],
            ['Scandinavia', 'Iceland'],
            
            ['Ukraine', 'Ural'],
            ['Ukraine', 'Afghanistan'],
            ['Ukraine', 'MiddleEast'],
            ['Ukraine', 'SouthernEurope'],
            ['Ukraine', 'NorthernEurope'],
            ['Ukraine', 'Scandinavia'],

            ['NorthernEurope', 'Scandinavia'],
            ['NorthernEurope', 'Ukraine'],
            ['NorthernEurope', 'SouthernEurope'],
            ['NorthernEurope', 'WesternEurope'],
            ['NorthernEurope', 'GreatBritain'],

            ['SouthernEurope', 'NorthernEurope'],
            ['SouthernEurope', 'Ukraine'],
            ['SouthernEurope', 'MiddleEast'],
            ['SouthernEurope', 'Egypt'],
            ['SouthernEurope', 'NorthAfrica'],
            ['SouthernEurope', 'WesternEurope'],

            ['WesternEurope', 'GreatBritain'],
            ['WesternEurope', 'NorthernEurope'],
            ['WesternEurope', 'SouthernEurope'],
            ['WesternEurope', 'NorthAfrica'],

            ['GreatBritain', 'Iceland'],
            ['GreatBritain', 'Scandinavia'],
            ['GreatBritain', 'NorthernEurope'],
            ['GreatBritain', 'WesternEurope'],

            ['NorthAfrica', 'WesternEurope'],
            ['NorthAfrica', 'SouthernEurope'],
            ['NorthAfrica', 'Egypt'],
            ['NorthAfrica', 'EastAfrica'],
            ['NorthAfrica', 'Brazil'],

            ['Egypt', 'SouthernEurope'],
            ['Egypt', 'MiddleEast'],
            ['Egypt', 'EastAfrica'],
            ['Egypt', 'NorthAfrica'],

            ['EastAfrica','Egypt'],
            ['EastAfrica', 'Madagascar'],
            ['EastAfrica', 'SouthAfrica'],
            ['EastAfrica', 'Congo'],
            ['EastAfrica', 'NorthAfrica'],

            ['Madagascar', 'EastAfrica'],
            ['Madagascar', 'SouthAfrica'],

            ['SouthAfrica', 'EastAfrica'],
            ['SouthAfrica', 'Madagascar'],
            ['SouthAfrica', 'Congo'],

            ['Congo','NorthAfrica'],
            ['Congo','EastAfrica'],
            ['Congo','SouthAfrica'],

            ['Ural','Siberia'],
            ['Ural','China'],
            ['Ural','Afghanistan'],
            ['Ural','Ukraine'],

            ['Siberia','Yakutsk'],
            ['Siberia','Irkutsk'],
            ['Siberia','Mongolia'],
            ['Siberia','China'],
            ['Siberia','Ural'],

            ['Yakutsk','Kamchatka'],
            ['Yakutsk','Irkutsk'],
            ['Yakutsk','Siberia'],

            ['Kamchatka','Alaska'],
            ['Kamchatka','Japan'],
            ['Kamchatka','Mongolia'],
            ['Kamchatka','Irkutsk'],
            ['Kamchatka','Yakutsk'],

            ['Irkutsk','Yakutsk'],
            ['Irkutsk','Kamchatka'],
            ['Irkutsk','Mongolia'],
            ['Irkutsk','Siberia'],

            ['Mongolia','Irkutsk'],
            ['Mongolia','Kamchatka'],
            ['Mongolia','Japan'],
            ['Mongolia','China'],
            ['Mongolia','Siberia'],

            ['Japan','Kamchatka'],
            ['Japan','Mongolia'],

            ['China','Siberia'],
            ['China','Mongolia'],
            ['China','Siam'],
            ['China','Hindustan'],
            ['China','Afghanistan'],
            ['China','Ural'],

            ['Afghanistan','Ural'],
            ['Afghanistan','China'],
            ['Afghanistan','Hindustan'],
            ['Afghanistan','MiddleEast'],
            ['Afghanistan','Ukraine'],

            ['MiddleEast','Ukraine'],
            ['MiddleEast','Afghanistan'],
            ['MiddleEast','Hindustan'],
            ['MiddleEast',"Egypt"],
            ['MiddleEast','SouthernEurope'],

            ['Hindustan','Afghanistan'],
            ['Hindustan','China'],
            ['Hindustan','Siam'],
            ['Hindustan','MiddleEast'],

            ['Siam','China'],
            ['Siam','Indonesia'],
            ['Siam','Hindustan'],

            ['Indonesia','NewGuinea'],
            ['Indonesia','Siam'],
            ['Indonesia','WesternAustralia'],        

            ['NewGuinea', 'Indonesia'],
            ['NewGuinea','EasternAustralia'],

            ['WesternAustralia','Indonesia'],
            ['WesternAustralia','EasternAustralia'],

            ['EasternAustralia','NewGuinea'],
            ['EasternAustralia','WesternAustralia'],
    ];

    const map: GameMap = {
        continents,
        territories,
        territoryBridges
    };

    const players: [Player, Player] = [
        { name: 'player1', displayName: 'Player 1' }, 
        { name: 'player2', displayName: 'Player 2' }];

    return {
        currentMap: map,
        currentPlayers: players,
        currentPositions: [],
        currentTurn: 'player1',
        selectedTerritory: undefined,
        onClickTerritory: (s) => {}
    };
}