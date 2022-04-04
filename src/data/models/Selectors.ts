import { ITerritoryProps } from "../../components/TerritoryTile";
import { IGameContext, ITileContext } from "./Contexts";
import {
  Continent,
  ContinentNameKey,
  CountryNameKey,
  Territory,
  TerritoryPathDefinition,
  TerritoryPotentialActions,
} from "./GameMap";
import { TerritoryState } from "./GameState";

export function getTerritoryFromContext(
  context: IGameContext,
  name: CountryNameKey
): Territory | undefined {
  return context.currentMap.territories.find((x) => x.name === name);
}

export function getContinentFromContext(
  context: IGameContext,
  name: ContinentNameKey
): Continent | undefined {
  return context.currentMap.continents.find((x) => x.name === name);
}

export function getTerritoryStateFromContext(
  context: IGameContext,
  name: CountryNameKey
): TerritoryState | undefined {
  return context.currentPositions.find((x) => x.territoryName === name);
}

export function getTerritoryPathDefinitionFromContext(
  context: IGameContext,
  name: string
): TerritoryPathDefinition | undefined {
  return context.currentMap.territoryPathDefinitions.find(
    (x) => x.name === name
  );
}

export function getPlayerIndexForNameFromContext(
  context: IGameContext,
  name: string
): number {
  return context.currentPlayers.findIndex((x) => x.name === name) ?? 0;
}

export function getPlayerIndexForTerritoryFromContext(
  context: IGameContext,
  territoryName: CountryNameKey
): number {
  let territory = getTerritoryStateFromContext(context, territoryName);

  if (territory === undefined) return 0;

  return (
    context.currentPlayers.findIndex((x) => x.name === territory?.playerName) ??
    0
  );
}

export function getPotentialActionsForTerritory(
  context: IGameContext,
  territoryName: CountryNameKey
): TerritoryPotentialActions {
  let territoryState = getTerritoryStateFromContext(context, territoryName);

  if (territoryState === undefined) return "None";

  if (
    territoryState.playerName === context.currentTurn &&
    territoryState.armies > 1 &&
    context.selectedTerritory === undefined
  )
    return "Select";

  if (
    context.currentMap.territoryBridges.find(
      (x) => x[0] === context.selectedTerritory && x[1] === territoryName
    ) !== undefined
  ) {
    if (
      territoryState.playerName !== context.currentTurn &&
      context.selectedTerritory !== undefined
    )
      return "Attack";
    if (
      territoryState.playerName === context.currentTurn &&
      context.selectedTerritory !== undefined
    )
      return "Move";
  }
  return "None";
}

export function buildTerritoryPropsForTile(
  context: ITileContext,
  name: CountryNameKey
): ITerritoryProps | string {
  let worldMapContext = context;

  const territory: Territory | undefined = getTerritoryFromContext(
    worldMapContext,
    name
  );

  if (territory === undefined) {
    return `ERROR WHAT IS ${name}`;
  }

  const continent: Continent | undefined = getContinentFromContext(
    worldMapContext,
    territory.continentName
  );

  if (continent === undefined) {
    return `ERROR WHAT IS ${territory.continentName}`;
  }

  const territoryPath: TerritoryPathDefinition | undefined =
    getTerritoryPathDefinitionFromContext(worldMapContext, name);

  if (territoryPath === undefined) {
    return `WHERE IS ${name}`;
  }

  const territoryState: TerritoryState | undefined =
    getTerritoryStateFromContext(worldMapContext, name);

  let ownerPlayerIndex = getPlayerIndexForTerritoryFromContext(
    worldMapContext,
    name
  );
  let actions = getPotentialActionsForTerritory(worldMapContext, name);
  let isSelected = name === worldMapContext.selectedTerritory;

  let [selectedTerritory, selectedTerritoryState] = getSelectedTerritory(
    worldMapContext
  ) ?? [undefined, undefined];

  let props: ITerritoryProps = {
    continent: continent,
    territory: territory,
    possibleArmiesToApply:
      selectedTerritoryState === undefined
        ? 0
        : selectedTerritoryState?.armies - 1 ?? 0,
    armies: territoryState?.armies ?? 0,
    potentialActions: actions,
    isTerritorySelected: isSelected,
    pathDefinition: territoryPath,
    ownerIndex: ownerPlayerIndex,
    select: () => worldMapContext.onClick(name),
    applyArmy: (selectedArmies) =>
      worldMapContext.applyArmies(name, selectedArmies),
  };
  return props;
}

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

function getSelectedTerritory(
  worldMapContext: ITileContext
): [Territory | undefined, TerritoryState | undefined] {
  if (worldMapContext.selectedTerritory === undefined)
    return [undefined, undefined];

  var territory = getTerritoryFromContext(
    worldMapContext,
    worldMapContext.selectedTerritory
  );
  var territoryState = getTerritoryStateFromContext(
    worldMapContext,
    worldMapContext.selectedTerritory
  );

  return [territory, territoryState];
}
