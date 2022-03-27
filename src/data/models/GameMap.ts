export type TerritoryPotentialActions = "None" | "Move" | "Attack" | "Select";
export type ContinentNameKey =  'NorthAmerica' | 'SouthAmerica'|'Europe'| 'Asia'| 'Africa'|'Oceania';
export type CountryNameKey = 'Alaska' |    'NorthWesternTerritory' |   'Alberta' |    'Ontario' |    'Quebec' |    'WesternUS' |    'EasternUS' |    'CentralAmerica' |    'Greenland' |    'Venezuela' |    'Brazil' |    'Peru' |    'Argentina' |    'Iceland' |    'GreatBritain' |    'WesternEurope' |    'Scandinavia' |    'NorthernEurope' |    'SouthernEurope' |    'Ukraine' |    'NorthAfrica' |    'Egypt' |    'EastAfrica' |    'Congo' |    'SouthAfrica' |    'Madagascar' |    'Afghanistan' |    'China' |    'Hindustan' |    'Irkutsk' |    'Japan' |    'Kamchatka' |    'MiddleEast' |    'Mongolia' |    'Siam' |    'Siberia' |    'Ural' |    'Yakutsk' |    'Indonesia' |    'NewGuinea' |    'WesternAustralia' |    'EasternAustralia';


export type Continent =  {
    name: ContinentNameKey
    displayName: string
}

export type Territory = {
    name: CountryNameKey 
    displayText: string
    continentName: ContinentNameKey
    value:number
}

export type TerritoryBridge = [CountryNameKey, CountryNameKey]   

export type GameMap = {
    continents: Continent[] 
    territories: Territory[]
    territoryBridges: TerritoryBridge[]
}

export default GameMap;