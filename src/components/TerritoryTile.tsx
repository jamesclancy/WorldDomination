import { Button, H5, Icon, Intent, Slider, Tag } from '@blueprintjs/core';
import { Popover2, Classes } from '@blueprintjs/popover2';
import { useContext, useEffect, useReducer, useState } from 'react';
import { ITileContext, WorldMapContext } from '../data/models/Contexts';
import { Continent, CountryNameKey, Territory, TerritoryPotentialActions } from '../data/models/GameMap';
import { TerritoryState } from '../data/models/GameState';
import { buildTerritoryPropsForTile, getTileClass } from '../data/models/Selectors';

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

export const NamedTerritoryTile = (props: INamedTerritoryTile) => {

    let worldMapContext = useContext<ITileContext>(WorldMapContext);

    let terPops = buildTerritoryPropsForTile(worldMapContext, props.name);

    if (typeof terPops === "string") {

        return (<td>{terPops}</td>);
    }
    return (
        <TerritoryTile {...terPops} rowSpan={props.rowSpan} colSpan={props.colSpan}
        />);
};


interface ITerritoryState {
    showPopover: boolean,
    selectedArmies: number,


}

interface ITerritoryStateAction {
    type: 'None'| 'TogglePopover' | 'SelectArmies' | 'Cancel' | 'Confirm',
    armyCount?: number
}

const territoryStateReducer = (state: ITerritoryState, action : ITerritoryStateAction) => {
    switch(action.type){
        case "Cancel":
            return {...state, showPopover: false};
        case "TogglePopover":
            return {...state, showPopover: !state.showPopover};
        case "SelectArmies":
            return {...state, selectedArmies: action.armyCount ?? 1};
    }

    return state;
};

const TerritoryTile = (props: ITerritoryProps) => {


    let initialState : ITerritoryState = { showPopover:false, selectedArmies: 1 };
    let [state, dispatch] = useReducer(territoryStateReducer, initialState);

    const isSelected = props.isTerritorySelected;
    const isClickable = props.potentialActions !== "None";

    function click() {
        if (isClickable)
            props.select();
    }

    function applyArmies() {
        togglePopover();
        props.applyArmy(state.selectedArmies);
    }

    function togglePopover() {
        dispatch({type: 'TogglePopover'})
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

    function setArmies(armies: number) {
        dispatch({type: 'SelectArmies', armyCount:armies });
    }

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
                onChange={setArmies} 
                value={state.selectedArmies} />
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
                    <div style={{ background: "#fff" }}><Button onClick={click} intent={getButtonIntent()}
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
                isOpen={state.showPopover}
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
