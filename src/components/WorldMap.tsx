import { Button, H1, H5, HTMLTable, Icon, Intent, Slider, Tag } from '@blueprintjs/core';
import { Popover2, Classes } from '@blueprintjs/popover2';
import { useContext, useEffect, useState } from 'react';
import { GameContext, IGameContext, ITileContext, WorldMapContext } from '../data/models/Contexts';
import { Continent, CountryNameKey, Territory, TerritoryPotentialActions } from '../data/models/GameMap';
import { TerritoryState } from '../data/models/GameState';
import Player from '../data/models/Player';
import { buildTerritoryPropsForTile, getTileClass } from '../data/models/Selectors';
import { rollBattleDice } from '../utilities/Randomization';

export interface ITerritoryProps {
    applyArmy(selectedArmies: number): void;
    potentialActions: TerritoryPotentialActions;
    isTerritorySelected: boolean;
    possibleArmiesToApply: number;
    territory: Territory,
    continent: Continent,
    territoryState?: TerritoryState,
    armies: number,
    colSpan?: number,
    rowSpan?: number,
    select(): void
}

export interface INamedTerritoryTile {
    name: CountryNameKey,
    colSpan?: number,
    rowSpan?: number
}

const NamedTerritoryTile = (props: INamedTerritoryTile) => {

    let worldMapContext = useContext<ITileContext>(WorldMapContext);
    let terPops = buildTerritoryPropsForTile(worldMapContext, props.name);

    if (typeof terPops === "string") {

        return (<td>{terPops}</td>);
    }
    return (
        <TerritoryTile {...terPops} rowSpan={props.rowSpan} colSpan={props.colSpan}
        />);
};


const TerritoryTile = (props: ITerritoryProps) => {

    let [showPopover, setShowPopover] = useState(false);
    let [selectedArmies, setSelectedArmies] = useState(props.possibleArmiesToApply);

    const isSelected = props.isTerritorySelected;
    const isClickable = props.potentialActions !== "None";

    function click() {
        if (isClickable)
            props.select();
    }

    function applyArmies() {
        togglePopover();
        props.applyArmy(selectedArmies);
    }

    function togglePopover() {
        setShowPopover(!showPopover);
    }

    function getButtonIcon() {
        if (isSelected) {
            return (<Icon icon="star" />);
        }
        switch (props.potentialActions) {
            case 'Attack':
                return (<Icon icon="locate" />);
            case 'Move':
                return (<Icon icon="flow-end" />);
            case 'Select':
                return (<Icon icon="map-marker" />);
        }
    };

    function getButtonIntent(): Intent {
        if (isSelected) {
            return Intent.PRIMARY;
        }
        switch (props.potentialActions) {
            case 'Attack':
                return Intent.DANGER
            case 'Move':
                return Intent.WARNING;
            case 'Select':
                return Intent.SUCCESS;
        }

        return Intent.NONE;
    };


    let popOverContent = () => {
        let slider = props.possibleArmiesToApply === 1 ?
            (<><p>Are you sure you want to use your only spare army?</p></>)
            : (<><p>Select armies to move.</p>
                <Slider key="slider" 
                min={1} 
                max={props.possibleArmiesToApply} 
                onChange={setSelectedArmies} 
                value={selectedArmies} />
            </>);

        return (
            <div className='popOverSelector'>
                <H5>Confirm {props.potentialActions}</H5>
                {slider}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}>
                    <Button className={Classes.POPOVER2_DISMISS} style={{ marginRight: 10 }} onClick={togglePopover}>
                        Cancel
                    </Button>
                    <Button intent={Intent.DANGER} className={Classes.POPOVER2_DISMISS} onClick={applyArmies}>
                        Confirm
                    </Button>
                </div>
            </div>
        );
    };

    switch (props.potentialActions) {
        case 'Select':
        case 'None':
            return (
                <td className={getTileClass(props.continent.name)}
                    rowSpan={props.rowSpan ?? 1}
                    colSpan={props.colSpan ?? 1}
                    height={200 * (props.rowSpan ?? 1)}
                    width={250 * (props.colSpan ?? 1)}
                >
                    <div style={{ background: "#fff", width: 300 }}><Button onClick={click} intent={getButtonIntent()}
                        large={true} disabled={props.potentialActions === "None"}
                        style={{ opacity: 1 }} fill={true}>
                        {getButtonIcon()}&nbsp;
                        {props.territory.displayText} &nbsp;
                        <Tag large={true}>{props.armies}</Tag>
                    </Button></div>
                </td>
            );
    }

    return (
        <td className={getTileClass(props.continent.name)}
            rowSpan={props.rowSpan ?? 1}
            colSpan={props.colSpan ?? 1}
            height={200 * (props.rowSpan ?? 1)}
            width={250 * (props.colSpan ?? 1)}
        >
            <Popover2
                enforceFocus={true}
                isOpen={showPopover}
                content={popOverContent()}
            >
                <div style={{ background: "#fff", width: 300 }}><Button onClick={togglePopover} intent={getButtonIntent()}
                    large={true} style={{ opacity: 1 }} fill={true}>
                    {getButtonIcon()}&nbsp;
                    {props.territory.displayText} &nbsp;
                    <Tag large={true}>{props.armies}</Tag>
                </Button></div>
            </Popover2>

        </td>
    );
}


interface IWorldMapControlPanelProps {
    selectedTerritory: string | undefined
    clearSelectedTerritory: () => void
}

const WorldMapControlPanel = (props: IWorldMapControlPanelProps) => {
    if (props.selectedTerritory === undefined)
        return (<h2>Please select a territory to move or attack from.</h2>)

    return (<h2>{props.selectedTerritory}<Button onClick={props.clearSelectedTerritory}>Clear Selection</Button></h2>);
};

const WorldMap = () => {

    let gameContext = useContext<IGameContext>(GameContext);

    const currentPlayers: [Player, Player] = gameContext.currentPlayers;
    let initialPositions = gameContext.currentPositions;

    let [currentPositions, setCurrentPositions] = useState(initialPositions);


    useEffect(() => {
        setCurrentPositions(initialPositions);
    }, [initialPositions]);

    let [currentTurn, setCurrentTurn] = useState(currentPlayers[0].name);
    let [selectedTerritory, setSelectedTerritory] = useState<CountryNameKey | undefined>(undefined);

    let switchUserTurn = () => {
        let otherUser = currentPlayers.find(x => x.name !== currentTurn);
        if (otherUser !== undefined)
            setCurrentTurn(otherUser.name);
    };

    let trySelectTerritory = (name: CountryNameKey) => {
        if (selectedTerritory === undefined) {
            setSelectedTerritory(name);
            return;
        }
    };

    let applyArmies = (name: CountryNameKey, selectedArmies: number) => {

        let positions = currentPositions;

        let selectedTerritoryState = positions.find(x => x.territoryName === selectedTerritory);
        let targetTerritoryState = positions.find(x => x.territoryName === name);

        if (selectedTerritoryState === undefined || targetTerritoryState === undefined)
            return;

        if (selectedTerritoryState.playerName === targetTerritoryState.playerName) {
            // If teh tile has the same owner just move the armies.
            selectedTerritoryState.armies -= selectedArmies;
            targetTerritoryState.armies += selectedArmies;
        } else {
            // If the tiles have different owners it is an attack.
            let [survivingAttackers, survivingDefenders] = rollBattleDice(selectedArmies, targetTerritoryState.armies);

            if (survivingDefenders === 0) {
                targetTerritoryState.playerName = selectedTerritoryState.playerName;
                targetTerritoryState.armies = survivingAttackers;
            } else {
                targetTerritoryState.armies = survivingDefenders;
                selectedTerritoryState.armies = selectedTerritoryState.armies - (selectedArmies - survivingAttackers);
            }
        }

        let updatedPositions = positions.filter(x=>x.territoryName !== name && x.territoryName !== selectedTerritory);
        updatedPositions.push(selectedTerritoryState);
        updatedPositions.push(targetTerritoryState);

        setSelectedTerritory(undefined);
        setCurrentPositions(updatedPositions);
        switchUserTurn();
    };

    let propsToAddToEachTile: ITileContext =
    {
        ...gameContext,
        currentPositions: currentPositions,
        currentTurn: currentTurn,
        selectedTerritory: selectedTerritory,
        onClick: trySelectTerritory,
        applyArmies: applyArmies
    };

    let clearSelectedTerritory = () => {
        setSelectedTerritory(undefined);
    };

    return (
        <div>
            <H1>Current Turn: {currentTurn}</H1>
            <WorldMapControlPanel selectedTerritory={selectedTerritory} 
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

export default WorldMap;
