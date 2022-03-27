import { Button, H1, HTMLTable } from '@blueprintjs/core';
import { useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { GameContext, IGameContext, ITileContext, WorldMapContext } from '../data/models/Contexts';
import { CountryNameKey } from '../data/models/GameMap';
import { TerritoryState } from '../data/models/GameState';
import Player from '../data/models/Player';
import { rollBattleDice } from '../utilities/Randomization';
import { NamedTerritoryTile } from './TerritoryTile';

const WorldMap = () => {

    let gameContext = useContext<IGameContext>(GameContext);

    const initialState: IWorldMapState = {
        currentPlayers: gameContext.currentPlayers,
        currentTurn: gameContext.currentPlayers[0].name,
        currentPositions: gameContext.currentPositions,
        selectedTerritory: undefined
    };

    let [state, dispatch] = useReducer(worldMapReducer, initialState);

    useEffect(() => {
        dispatch({type:'LoadInitialState', initialState: initialState});
        console.log("contextswitch");
    }, [gameContext]);

    let applyArmies = (name: CountryNameKey, selectedArmies: number) => {
        dispatch({ type: 'TargetTile', armiesToApply: selectedArmies, target: name });
    };

    let trySelectTerritory = (name: CountryNameKey) => {
        dispatch({ type: 'SelectTile', target: name });
    };

    let propsToAddToEachTile: ITileContext =
    {
        ...gameContext,
        currentPositions: state.currentPositions,
        currentTurn: state.currentTurn,
        selectedTerritory: state.selectedTerritory,
        onClick: trySelectTerritory,
        applyArmies: applyArmies
    };

    let clearSelectedTerritory = () => {
        dispatch({ type: 'ClearSelection' });
    };

    return (
        <div>
            <H1>Current Turn: {state.currentTurn}</H1>
            <WorldMapControlPanel selectedTerritory={state.selectedTerritory}
                clearSelectedTerritory={clearSelectedTerritory} />
            <HTMLTable>
                <WorldMapContext.Provider value={propsToAddToEachTile}>
                    <tbody className='waterTile'>
                        <tr>
                            <NamedTerritoryTile name="Alaska" />
                            <NamedTerritoryTile name="NorthWesternTerritory" colSpan={2} />
                            <td></td>
                            <NamedTerritoryTile name="Greenland" />
                            <td></td>
                            <NamedTerritoryTile name="Scandinavia" />
                            <NamedTerritoryTile name="Ukraine" rowSpan={3} />
                            <NamedTerritoryTile name="Ural" rowSpan={2} />
                            <NamedTerritoryTile name="Siberia" />
                            <NamedTerritoryTile name="Yakutsk" />
                            <NamedTerritoryTile name="Kamchatka" />
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <NamedTerritoryTile name="Alberta" />
                            <NamedTerritoryTile name="Ontario" />
                            <NamedTerritoryTile name="Quebec" />
                            <td></td>
                            <NamedTerritoryTile name="Iceland" />
                            <NamedTerritoryTile name="NorthernEurope" rowSpan={2} />
                            <NamedTerritoryTile name="Afghanistan" />
                            <NamedTerritoryTile name="Irkutsk" />
                            <td></td>
                            <NamedTerritoryTile name="Japan" />
                        </tr>
                        <tr>
                            <td></td>
                            <NamedTerritoryTile name="WesternUS" />
                            <NamedTerritoryTile name="EasternUS" />
                            <td></td>
                            <td></td>
                            <NamedTerritoryTile name="GreatBritain" />
                            <NamedTerritoryTile name="Mongolia" />
                            <NamedTerritoryTile name="China" />
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <NamedTerritoryTile name="CentralAmerica" />
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <NamedTerritoryTile name="WesternEurope" />
                            <NamedTerritoryTile name="SouthernEurope" />
                            <NamedTerritoryTile name="MiddleEast" />
                            <NamedTerritoryTile name="Hindustan" />
                            <NamedTerritoryTile name="Siam" />
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <NamedTerritoryTile name="Venezuela" />
                            <td></td>
                            <td></td>
                            <td></td>
                            <NamedTerritoryTile name="NorthAfrica" />
                            <NamedTerritoryTile name="Egypt" />
                            <td></td>
                            <td></td>
                            <td></td>
                            <NamedTerritoryTile name="Indonesia" />
                            <NamedTerritoryTile name="NewGuinea" />
                            <td></td>
                        </tr>
                        <tr>
                            <NamedTerritoryTile name="Peru" />
                            <NamedTerritoryTile name="Brazil" colSpan={2} />
                            <td></td>
                            <td></td>
                            <NamedTerritoryTile name="Congo" />
                            <NamedTerritoryTile name="EastAfrica" />
                            <td></td>
                            <td></td>
                            <td></td>
                            <NamedTerritoryTile name="WesternAustralia" />
                            <NamedTerritoryTile name="EasternAustralia" />
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <NamedTerritoryTile name="Argentina" />
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <NamedTerritoryTile name="SouthAfrica" />
                            <NamedTerritoryTile name="Madagascar" />
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </WorldMapContext.Provider>
            </HTMLTable>
        </div>
    )
};

interface IWorldMapControlPanelProps {
    selectedTerritory: string | undefined
    clearSelectedTerritory: () => void
}

const WorldMapControlPanel = (props: IWorldMapControlPanelProps) => {
    if (props.selectedTerritory === undefined)
        return (<h2>Please select a territory to move or attack from.</h2>)

    return (<h2>{props.selectedTerritory}<Button onClick={props.clearSelectedTerritory}>Clear Selection</Button></h2>);
};

interface IWorldMapState {
    currentPlayers: [Player, Player],
    currentTurn: string,
    currentPositions: TerritoryState[],
    selectedTerritory: CountryNameKey | undefined;
}

interface IWorldMapAction {
    type: 'None' | 'SelectTile' | 'TargetTile' | 'ClearSelection' | 'LoadInitialState'
    target?: CountryNameKey,
    armiesToApply?: number
    initialState?: IWorldMapState
}


function executeMovement(currentPositions: TerritoryState[], selectedTerritory: CountryNameKey, targetTerritory: CountryNameKey, selectedArmies: number): TerritoryState[] {
    let positions = currentPositions;

    let selectedTerritoryState = positions.find(x => x.territoryName === selectedTerritory);
    let targetTerritoryState = positions.find(x => x.territoryName === targetTerritory);

    let updatedSelectedTerritoryState;
    let updatedTargetTerritoryState;

    if (selectedTerritoryState === undefined || targetTerritoryState === undefined)
        return positions;

    if (selectedTerritoryState.playerName === targetTerritoryState.playerName) {
        // If the tile has the same owner just move the armies.
        updatedSelectedTerritoryState = { ...selectedTerritoryState, armies: selectedTerritoryState.armies - selectedArmies };
        updatedTargetTerritoryState = { ...targetTerritoryState, armies: targetTerritoryState.armies + selectedArmies };
    } else {
        // If the tiles have different owners it is an attack.
        let [survivingAttackers, survivingDefenders] = rollBattleDice(selectedArmies, targetTerritoryState.armies);

        if (survivingDefenders === 0) {
            updatedSelectedTerritoryState = { ...selectedTerritoryState, armies: selectedTerritoryState.armies - selectedArmies };
            updatedTargetTerritoryState = { ...targetTerritoryState, armies: survivingAttackers, playerName: selectedTerritoryState.playerName };
        } else {
            updatedSelectedTerritoryState = { ...selectedTerritoryState, armies: selectedTerritoryState.armies - (selectedArmies - survivingAttackers) };
            updatedTargetTerritoryState = { ...targetTerritoryState, armies: survivingDefenders };
        }
    }

    let updatedPositions = positions.filter(x => x.territoryName !== targetTerritory && x.territoryName !== selectedTerritory);
    updatedPositions.push(updatedSelectedTerritoryState);
    updatedPositions.push(updatedTargetTerritoryState);

    return updatedPositions;
}

let worldMapReducer = (state: IWorldMapState, action: IWorldMapAction) => {
    switch (action.type) {
        case 'LoadInitialState':
            if(action.initialState)
                return action.initialState;
            break;
        case 'ClearSelection':
            state.selectedTerritory = undefined;
            return state;
        case 'SelectTile':
            if (!state.selectedTerritory && action.target)
                return {...state, selectedTerritory: action.target  };
            return state;
        case 'TargetTile':
            if (!state.selectedTerritory || !action.armiesToApply || !action.target)
                return state;

            let otherUser = state.currentPlayers.find(x => x.name !== state.currentTurn)?.name ?? state.currentTurn;
            let updatedPositions = executeMovement(state.currentPositions, state.selectedTerritory, action.target, action.armiesToApply);
            return { ...state, currentPositions: updatedPositions, selectedTerritory: undefined, currentTurn: otherUser };
    }
    return state;
}

export default WorldMap;
