import { ContextMenu } from "@blueprintjs/core";
import { isPropertySignature } from "typescript";
import { ITerritoryProps } from "../../components/WorldMap";
import { constructInitialGameContext } from "../services/WorldBuilder";
import { IGameContext, ITileContext } from "./Contexts";
import { Continent, ContinentNameKey, CountryNameKey, Territory, TerritoryPotentialActions } from "./GameMap";
import { TerritoryState } from "./GameState";

export function getTerritoryFromContext(context: IGameContext, name: CountryNameKey) : Territory | undefined 
{
    return context
    .currentMap.territories
    .find((x) => x.name === name);
}

export function getContinentFromContext(context: IGameContext, name: ContinentNameKey) : Continent | undefined 
{
    return context
    .currentMap.continents
    .find((x) => x.name === name);
}


export function getTerritoryStateFromContext(context: IGameContext, name: CountryNameKey) : TerritoryState | undefined 
{
    return context.currentPositions
    .find((x) => x.territoryName === name);
}

export function getPlayerIndexForNameFromContext(context: IGameContext, name: string) : number {
    return context.currentPlayers
    .findIndex(x => x.name === name) ?? 0;
}

export function getPlayerIndexForTerritoryFromContext(context: IGameContext, territoryName: CountryNameKey) : number {
    let territory = getTerritoryStateFromContext(context, territoryName);

    if(territory === undefined)
        return 0;
    
    return context.currentPlayers
    .findIndex(x => x.name === territory?.playerName) ?? 0;
}

export function getPotentialActionsForTerritory(context: IGameContext, territoryName: CountryNameKey): TerritoryPotentialActions {
    
    let territoryState = getTerritoryStateFromContext(context, territoryName);
    
    if (territoryState === undefined)
        return "None";

    if (territoryState.playerName === context.currentTurn && territoryState.armies > 1
        && context.selectedTerritory === undefined)
        return "Select";

    if ((context.currentMap.territoryBridges.find((x) => x[0] === context.selectedTerritory && x[1] === territoryName) !== undefined)) {
        if (territoryState.playerName !== context.currentTurn
            && context.selectedTerritory !== undefined)
            return "Attack";
        if (territoryState.playerName === context.currentTurn
            && context.selectedTerritory !== undefined)
            return "Move";
    }
    return "None"
};

export function buildTerritoryPropsForTile(context : ITileContext,   name: CountryNameKey) : ITerritoryProps | string {
    let worldMapContext = context;

    const territory: Territory | undefined = getTerritoryFromContext(worldMapContext, name);

    if (territory === undefined) {
        return `ERROR WHAT IS ${name}`;
    }

    const continent: Continent | undefined = getContinentFromContext(worldMapContext, territory.continentName);

    if (continent === undefined) {
        return `ERROR WHAT IS ${territory.continentName}`;
    }

    const territoryState: TerritoryState | undefined
        = getTerritoryStateFromContext(worldMapContext, name);

    let ownerPlayerIndex = getPlayerIndexForTerritoryFromContext(worldMapContext, name);
    let actions = getPotentialActionsForTerritory(worldMapContext, name);
    let isSelected = name === worldMapContext.selectedTerritory;

    let [selectedTerritory, selectedTerritoryState] = (getSelectedTerritory(worldMapContext) ?? [undefined, undefined]);

    let props  : ITerritoryProps=  {
    continent:continent ,
    territory:territory, 
    possibleArmiesToApply:selectedTerritoryState === undefined ? 0 : selectedTerritoryState ?.armies - 1 ?? 0,
    armies: territoryState?.armies ?? 0,
    potentialActions:actions,
    isTerritorySelected:isSelected,
    select:() => worldMapContext.onClick(name),
    applyArmy:(selectedArmies) => worldMapContext.applyArmies(name, selectedArmies)
    };
    return props;
}

export function getContinentColor(continentName: ContinentNameKey, playerIndex: number, isSelected: boolean, isClickable: boolean) {
    let saturation = getSaturationLevel(isSelected, isClickable);

    switch (continentName) {
        case "NorthAmerica":
            return `#00${saturation}`;
        case "SouthAmerica":
            return `#00${saturation}`;
        case "Europe":
            return `#00${saturation}`;
        case "Asia":
            return `#${saturation}${saturation}0`;
        case "Africa":
            return `#0${saturation}${saturation}`;
        case "Oceania":
            return `#${saturation}0${saturation}`;
        default:
            return `#${saturation}${saturation}${saturation}`;
    };
}

function getSaturationLevel(isSelected: boolean, isClickable: boolean) {
    if (isSelected) return "c";
    if (isClickable) return "f";
    return "9";
}

function getContinentBackgroundImage(continentName: ContinentNameKey, playerIndex: number, isSelected: boolean, isClickable: boolean) {
    switch (continentName) {
        case "NorthAmerica":
            return `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='20' height='35' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M0 0v15h20V0H0zm10.135 2.4l1.342 3.579 3.845.312-2.996 2.506.897 3.8-3.268-2.056L6.736 12.6l.985-3.848-3.043-2.504 3.935-.18L10.135 2.4z'  stroke-width='1' stroke='none' fill='hsla(258.5,59.4%,59.4%,1)'/><path d='M0 30h20v5H0zm0-10h20v5H0z'  stroke-width='1' stroke='none' fill='hsla(339.6,82.2%,51.6%,1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`;
        case "SouthAmerica":
            return `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='36' height='36' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M3.445 3.624a5 5 0 01-6.89 0m8.973 4.709a10 10 0 01-11.056 0m2.083 24.043a5 5 0 016.89 0m-8.973-4.709a10 10 0 0111.056 0M39.444 3.624a5 5 0 01-6.889 0m8.973 4.709a10 10 0 01-11.056 0m2.082 24.043a5 5 0 016.891 0m-8.973-4.709a10 10 0 0111.056 0m-20.082-6.043a5 5 0 01-6.891 0m0-7.247a5 5 0 016.89 0m2.083 11.956a10 10 0 01-11.056.001m0-16.666a10 10 0 0111.056-.001'  stroke-linecap='square' stroke-width='1' stroke='hsla(258.5,59.4%,59.4%,1)' fill='none'/><path d='M21.624-3.445a5 5 0 010 6.89m-7.247 0a5 5 0 010-6.89m11.956-2.083a10 10 0 01.001 11.056m-16.666 0a10 10 0 01-.002-11.056m11.958 38.083a5 5 0 010 6.89m-7.247 0a5 5 0 01-.001-6.89m11.956-2.083a10 10 0 01.002 11.056m-16.666 0a10 10 0 01-.002-11.056M3.624 14.555a5 5 0 010 6.891m4.71-8.974a10 10 0 01-.001 11.056m24.042-2.082a5 5 0 01.001-6.891m-4.71 8.974a10 10 0 010-11.056'  stroke-linecap='square' stroke-width='1' stroke='hsla(339.6,82.2%,51.6%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`;
        case "Europe":
            return `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='50' height='50' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M25 3.95L22.3 9.2c-1.45 2.75-.95 6.15 1.25 8.35L25 19l1.45-1.45c2.15-2.2 2.65-5.6 1.25-8.35zm0 7.5c.85 0 1.5.7 1.5 1.5 0 .85-.65 1.5-1.5 1.5s-1.5-.7-1.5-1.5c0-.85.65-1.5 1.5-1.5zm-13.1.45l.75 5.6c.15 1.15 1 2.05 2.1 2.35l6.8 1.7-1.7-6.8c-.25-1.1-1.2-1.95-2.35-2.1zm26.2 0l-5.6.75c-1.15.15-2.05 1-2.35 2.1l-1.7 6.8 6.8-1.7c1.1-.25 1.95-1.2 2.1-2.35zm-21.4 3.4c.75 0 1.4.6 1.4 1.4 0 .4-.15.75-.4 1s-.6.4-1 .4c-.75 0-1.4-.6-1.4-1.4 0-.35.15-.75.4-1s.6-.4 1-.4zm16.55 0c.4 0 .75.15 1 .4s.4.6.4 1c0 .75-.6 1.4-1.4 1.4-.4 0-.75-.15-1-.4s-.4-.6-.4-1c0-.75.6-1.4 1.4-1.4zm4.28 6.179a7.102 7.102 0 00-5.08 2.072L31 25l1.45 1.45c2.2 2.15 5.6 2.65 8.35 1.25l5.25-2.7-5.25-2.7a7.126 7.126 0 00-3.27-.821zm-25.06.035a7.267 7.267 0 00-3.27.787L3.95 25l5.25 2.7c2.75 1.45 6.15.95 8.35-1.25L19 25l-1.45-1.45c-1.374-1.343-3.218-2.043-5.08-2.036zm12.53.685c-.75 0-1.45.301-1.95.801s-.8 1.2-.8 1.95.3 1.45.8 1.95 1.2.8 1.95.8 1.45-.3 1.95-.8.8-1.2.8-1.95-.3-1.45-.8-1.95-1.2-.8-1.95-.8zm12 1.25c.85 0 1.5.65 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.65-1.5-1.5.7-1.5 1.5-1.5zM13 23.5c.8 0 1.5.65 1.5 1.5s-.7 1.5-1.5 1.5c-.85 0-1.5-.65-1.5-1.5s.7-1.5 1.5-1.5zm8.55 4.95l-6.8 1.7c-1.1.25-1.95 1.2-2.1 2.35l-.75 5.6 5.6-.75c1.15-.15 2.05-1 2.35-2.1zm6.9 0l1.7 6.8c.25 1.1 1.2 1.95 2.35 2.1l5.6.7-.75-5.6c-.15-1.15-1-2.05-2.1-2.35zM25 31l-1.45 1.45c-2.15 2.2-2.65 5.6-1.25 8.35l2.7 5.25 2.7-5.25c1.45-2.75.95-6.15-1.25-8.35zm8.3.85c.75 0 1.4.6 1.4 1.4 0 .4-.15.75-.4 1s-.6.4-1 .4c-.75 0-1.4-.6-1.4-1.4 0-.4.15-.75.4-1s.6-.4 1-.4zm-16.55.05c.4 0 .75.15 1 .4s.4.6.4 1c0 .75-.6 1.4-1.4 1.4-.4 0-.75-.2-1-.4-.25-.25-.4-.6-.4-1 0-.75.6-1.4 1.4-1.4zM25 35.5c.85 0 1.5.7 1.5 1.5 0 .85-.65 1.5-1.5 1.5s-1.5-.7-1.5-1.5.65-1.5 1.5-1.5z'  stroke-width='1' stroke='none' fill='hsla(258.5,59.4%,59.4%,1)'/><path d='M1 0c.5.9 1.45 1.5 2.55 1.5C4.65 1.5 5.6.9 6.1 0zm42.9 0c.5.9 1.45 1.5 2.55 1.5C47.55 1.5 48.5.9 49 0zM0 1v5.1c.9-.5 1.5-1.45 1.5-2.55C1.5 2.45.9 1.5 0 1zm50 0c-.9.5-1.5 1.45-1.5 2.55 0 1.1.6 2.05 1.5 2.55zM0 43.9V49c.9-.5 1.5-1.45 1.5-2.55 0-1.1-.6-2.05-1.5-2.55zm50 0c-.9.5-1.5 1.45-1.5 2.55 0 1.1.6 2.05 1.5 2.55zM3.55 48.5c-1.1 0-2.05.6-2.55 1.5h5.1c-.5-.9-1.45-1.5-2.55-1.5zm42.9 0c-1.1 0-2.05.6-2.55 1.5H49c-.5-.9-1.45-1.5-2.55-1.5z'  stroke-width='1' stroke='none' fill='hsla(339.6,82.2%,51.6%,1)'/><path d='M11.7 0A28.002 28.002 0 00.05 11.65v1.45c1.3-2.8 3.1-5.4 5.4-7.65A27.64 27.64 0 0113.15 0H11.7zm25.2.05c2.8 1.3 5.4 3.1 7.65 5.4a27.64 27.64 0 015.45 7.7V11.7A28.002 28.002 0 0038.35.05H36.9zm-16.6.9a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm9.4 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zM17.65 3.6a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm14.7 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm-17.4 2.65a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm20.1 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zM12.3 8.9a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm25.4 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zM9.45 11.75a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm31.1 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zM6.8 14.4a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm36.4 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zM4.15 17.05a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm41.7 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zM1.5 19.75a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm47 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm-47 9.4a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm47 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zM4.15 31.8a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm41.7 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zM6.8 34.45a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm36.4 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zM0 36.85v1.45a28.002 28.002 0 0011.65 11.65h1.45c-2.8-1.3-5.4-3.15-7.65-5.4A27.64 27.64 0 010 36.85zm49.95 0a25.563 25.563 0 01-5.4 7.7 27.64 27.64 0 01-7.7 5.45h1.45a28.002 28.002 0 0011.65-11.65v-1.5zm-40.5.3a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm31.1 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm-28.25 2.8a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm25.4 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm-22.75 2.7a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm20.1 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm-17.4 2.65a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm14.7 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zM20.3 47.95a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55zm9.4 0a.55.55 0 00-.55.55.55.55 0 00.55.55.55.55 0 00.55-.55.55.55 0 00-.55-.55z'  stroke-width='1' stroke='none' fill='hsla(198.7,97.6%,48.4%,1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`;
        case "Asia":
            return `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='69.283' height='40' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M46.189-20L57.736 0M46.189 20l11.547 20m-46.189 0l11.547 20M11.547 0l11.547 20m40.415 30H40.415M28.868 30H5.774m23.094-40H5.774m57.735 20H40.415m0 20L28.868 50m11.547-60L28.868 10m46.188 0L63.509 30M5.774 10L-5.773 30m75.056 10H46.189L34.64 20 46.19 0h23.094C73.13 6.667 76.98 13.333 80.83 20zM57.736 60H34.64L23.094 40l11.547-20h23.095c3.848 6.667 7.698 13.333 11.547 20L57.736 60zm0-40H34.64L23.094 0l11.547-20h23.095L69.283 0c-3.87 6.7-8.118 14.06-11.547 20zM34.64 60H11.547L0 40l11.547-20h23.094L46.19 40 34.64 60zm0-40H11.547L0 0l11.547-20h23.094L46.19 0 34.64 20zM23.094 40H0l-5.773-10-5.774-10L0 0h23.094l11.547 20-11.547 20z'  stroke-width='1' stroke='hsla(258.5,59.4%,59.4%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`;
        case "Africa":
            return `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='38.907' height='70' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M.582-16.627S.832-6.236 5.736-.25c1.996 2.494 3.908 4.24 5.405 5.57 1.496 1.247 3.822.333 4.072-1.662.083-.997-.333-1.911-1.164-2.41C11.056-.664 3.824-6.069.582-16.627zm37.742 0C35.082-6.069 27.85-.664 24.857 1.248a2.921 2.921 0 00-1.248 2.41c.25 1.995 2.578 2.91 4.075 1.662 1.58-1.33 3.49-3.076 5.486-5.57 4.905-5.986 5.154-16.377 5.154-16.377zM.582-8.313s-.25 7.15 3.076 13.385c.998 1.995 2.66 4.572 3.824 5.903 1.414 1.58 3.99.914 4.489-1.164.25-.998-.082-1.914-.83-2.579C8.73 5.237 3.409.084.582-8.313zm37.742 0C35.498.084 30.178 5.237 27.768 7.232c-.749.665-1.082 1.664-.832 2.579.415 2.078 3.077 2.743 4.49 1.164 1.164-1.247 2.826-3.908 3.824-5.903 3.325-6.235 3.074-13.385 3.074-13.385zM.666 1.414s-.25 6.651 1.828 11.889c.416 1.164.915 2.243 1.414 3.074.998 1.912 3.74 1.581 4.405-.414.332-.915 0-1.913-.749-2.578C5.735 11.888 2.495 8.397.666 1.415zm37.742.166c-1.912 6.9-5.153 10.392-6.982 11.889-.748.582-1.083 1.661-.75 2.576.665 1.995 3.408 2.245 4.406.416.499-.831 1-1.828 1.498-2.992C38.658 8.23 38.408 1.58 38.408 1.58zm.416 9.145s-.832 4.323-2.994 7.482c-.997 1.496-.664 2.909-.082 3.906.416.665.832 1.165 1.414 1.58l1.744 1.33 1.746-1.33c.582-.498 1.082-.998 1.414-1.58.582-.997.914-2.326-.25-3.906-2.161-3.16-2.992-7.482-2.992-7.482zM0 10.809s-.83 4.321-2.992 7.48c-.998 1.496-.665 2.827-.166 3.824.415.665.83 1.165 1.412 1.58L0 25.023l1.746-1.33c.582-.498 1.08-.998 1.412-1.58.582-.997.915-2.328-.166-3.824C.831 15.13 0 10.81 0 10.81zm.582 34.25s-.166 9.56 5.736 16.793c2.079 2.577 4.074 4.49 5.737 5.82 1.912 1.58 4.654.083 4.488-2.328-.083-.915-.58-1.745-1.412-2.16C12.138 61.438 4.489 56.199.582 45.059zm37.742.084c-3.907 11.223-11.554 16.46-14.547 18.123-.831.415-1.33 1.247-1.414 2.162-.166 2.41 2.576 3.824 4.489 2.328 1.662-1.33 3.658-3.243 5.736-5.82 5.902-7.233 5.736-16.793 5.736-16.793zM.582 53.289s.25 10.393 5.154 16.379c1.996 2.494 3.908 4.321 5.405 5.568 1.496 1.247 3.822.333 4.072-1.662.083-.997-.333-1.911-1.164-2.41C11.056 69.252 3.824 63.847.582 53.29zm37.742.084C35.082 63.931 27.85 69.334 24.857 71.246c-.83.499-1.248 1.415-1.248 2.412.25 1.995 2.578 2.91 4.075 1.662 1.58-1.33 3.49-3.076 5.486-5.57 4.905-5.986 5.154-16.377 5.154-16.377zM.582 61.686s-.25 7.15 3.076 13.384c.998 1.996 2.66 4.573 3.824 5.903 1.414 1.58 3.99.914 4.489-1.164.25-.998-.082-1.911-.83-2.577C8.73 75.237 3.409 70.082.582 61.686zm37.742 0c-2.826 8.396-8.146 13.551-10.556 15.546-.749.666-1.082 1.662-.832 2.577.415 2.078 3.077 2.743 4.49 1.164 1.164-1.33 2.826-3.99 3.824-5.903 3.325-6.235 3.074-13.384 3.074-13.384z'  stroke-width='1' stroke='none' fill='hsla(258.5,59.4%,59.4%,1)'/><path d='M20.035 10.06s-.166 9.56 5.736 16.794c2.079 2.577 4.074 4.488 5.737 5.818 1.912 1.58 4.656.083 4.49-2.328-.083-.915-.583-1.745-1.414-2.16-2.993-1.746-10.642-6.9-14.549-18.123zm-1.164.083C14.964 21.366 7.315 26.603 4.322 28.266c-.831.415-1.329 1.247-1.412 2.162-.166 2.41 2.576 3.824 4.488 2.328 1.663-1.33 3.658-3.243 5.737-5.82 5.902-7.233 5.736-16.793 5.736-16.793zm0 8.23C15.63 28.931 8.397 34.334 5.404 36.246c-.831.499-1.248 1.498-1.248 2.412.25 1.995 2.578 2.91 4.074 1.662 1.58-1.33 3.492-3.076 5.487-5.57 4.905-5.986 5.154-16.377 5.154-16.377zm1.164 0s.25 10.391 5.154 16.377a50.364 50.364 0 005.405 5.57c1.496 1.247 3.825.333 4.074-1.662.083-.997-.333-1.913-1.164-2.412-2.993-1.912-10.227-7.315-13.469-17.873zm-1.164 8.314c-2.826 8.397-8.148 13.55-10.558 15.545-.749.666-1.08 1.664-.83 2.579.415 2.078 3.074 2.743 4.488 1.164 1.164-1.33 2.826-3.91 3.824-5.905 3.325-6.235 3.076-13.383 3.076-13.383zm1.164 0s-.25 7.148 3.076 13.383c.998 1.996 2.66 4.574 3.825 5.905 1.413 1.58 3.991.914 4.49-1.164.25-.998-.084-1.913-.832-2.579-2.411-1.995-7.732-7.148-10.559-15.545zm.084 9.727s-.25 6.65 1.828 11.887c.416 1.164.916 2.245 1.414 3.076.998 1.912 3.741 1.58 4.407-.416.332-.915 0-1.911-.748-2.576-1.83-1.497-5.072-4.988-6.9-11.97zm-1.164.166c-1.912 6.9-5.155 10.392-6.984 11.889-.749.582-1.08 1.661-.748 2.576.665 1.995 3.408 2.245 4.406.416.499-.831.997-1.828 1.496-2.992 2.078-5.238 1.83-11.889 1.83-11.889zm.416 9.145s-.833 4.323-2.994 7.482c-.998 1.496-.664 2.909-.082 3.906.416.665.83 1.165 1.412 1.58l1.746 1.33 1.746-1.33c.582-.498 1.082-.998 1.414-1.58.582-.997.914-2.326-.25-3.906-2.161-3.16-2.992-7.482-2.992-7.482z'  stroke-width='1' stroke='none' fill='hsla(339.6,82.2%,51.6%,1)'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`;
        case "Oceania":
            return `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='32' height='32' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M40 16h-6m-4 0h-6m8 8v-6m0-4V8M8 16H2m-4 0h-6m8 8v-6m0-4V8'  stroke-linejoin='round' stroke-linecap='round' stroke-width='1.5' stroke='hsla(258.5,59.4%,59.4%,1)' fill='none'/><path d='M16-8v6m0 4v6m8-8h-6m-4 0H8m8 24v6m0 4v6m8-8h-6m-4 0H8'  stroke-linejoin='round' stroke-linecap='round' stroke-width='1.5' stroke='hsla(339.6,82.2%,51.6%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`;
        default:
            return `url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='32' height='32' patternTransform='scale(1) rotate(0)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M40 16h-6m-4 0h-6m8 8v-6m0-4V8M8 16H2m-4 0h-6m8 8v-6m0-4V8'  stroke-linejoin='round' stroke-linecap='round' stroke-width='1.5' stroke='hsla(258.5,59.4%,59.4%,1)' fill='none'/><path d='M16-8v6m0 4v6m8-8h-6m-4 0H8m8 24v6m0 4v6m8-8h-6m-4 0H8'  stroke-linejoin='round' stroke-linecap='round' stroke-width='1.5' stroke='hsla(339.6,82.2%,51.6%,1)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>")`;
    };

};

export function getTileClass(continentName: ContinentNameKey) {
    switch (continentName) {
        case "NorthAmerica":
            return `northAmericaTile`;
        case "SouthAmerica":
            return `southAmericaTile`;
        case "Europe":
            return `europeTile`;
        case "Asia":
            return `africaTile`;
        case "Africa":
            return `asiaTile`;
        case "Oceania":
            return `oceaniaTile`;
        default:
            return `idkTile`;
    }
}

function getSelectedTerritory(worldMapContext: ITileContext) : [Territory | undefined, TerritoryState | undefined]{
    if(worldMapContext.selectedTerritory == undefined)
        return [undefined, undefined];
    
    var territory = getTerritoryFromContext(worldMapContext, worldMapContext.selectedTerritory);
    var territoryState = getTerritoryStateFromContext(worldMapContext, worldMapContext.selectedTerritory);

    return [territory, territoryState];
}