import { Button, Card,  H3, InputGroup, Intent } from "@blueprintjs/core";
import { Cell, Column, EditableCell, Table2 } from "@blueprintjs/table";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Territory } from "../data/models/GameMap";
import { TerritoryState } from "../data/models/GameState";
import Player from "../data/models/Player";
import { shuffle } from "../utilities/Randomization";

export interface ITerritorySelectProps {
    onStartGame(results: TerritoryState[], players: [Player, Player]): void;
    Territories: Territory[]
}

const TerritorySelect = (props: ITerritorySelectProps) => {


    let initData =
        props.Territories.map(x =>
            [x.continentName, x.name, "", "0"]
        );

    let startingIntents = props.Territories.map(x =>
        [Intent.NONE, Intent.NONE, Intent.NONE, Intent.NONE]
    );

    const [cellIntents, setCellIntents] = useState<Intent[][]>(startingIntents);
    const [dataForTable, setDataForTable] = useState(initData);
    const [player1Name, setPlayer1Name] = useState("player1");
    const [player2Name, setPlayer2Name] = useState("player2");
    const [canSubmitData, setCanSubmitData] = useState(true);

    const setRandomDataSet = () => {
        let totalPlayer1 = 40 - dataForTable.length / 2;
        let totalPlayer2 = 40 - dataForTable.length / 2;

        function armiesToApply(playerName: string) {
            let armiesToApply = 1;
            if (playerName === player1Name) {
                let ran = Math.floor(Math.random() * totalPlayer1);
                armiesToApply += ran;
                totalPlayer1 -= ran;
            }

            if (playerName === player2Name) {
                let ran = Math.floor(Math.random() * totalPlayer2);
                armiesToApply += ran;
                totalPlayer2 -= ran;
            }
            return armiesToApply;
        }

        const shuffledDataForTable = shuffle(dataForTable);

        let playerPicks = shuffledDataForTable.map((x, index) =>
        ({
            value: (index % 2 === 0 ? player1Name : player2Name),
            sort: Math.random(),
            armiesToApply: armiesToApply(index % 2 === 0 ? player1Name : player2Name)
        })).sort(x => x.sort);

        let updatedDataForTable = shuffledDataForTable.map((x, rowIndex) => {

            x[2] = playerPicks[rowIndex].value;
            x[3] = playerPicks[rowIndex].armiesToApply.toString();
            return x;
        });

        updatedDataForTable.forEach((element, index) => {
            if (totalPlayer1 > 0 && element[2] === player1Name) {
                element[3] = (parseInt(element[3]) + 1).toString();
                totalPlayer1--;
            }
        });


        updatedDataForTable.forEach((element, index) => {
            if (totalPlayer2 > 0 && element[2] === player2Name) {
                element[3] = (parseInt(element[3]) + 1).toString();
                totalPlayer2--;
            }
        });

        setDataForTable(updatedDataForTable);
    };


    const attemptToUpdatePlayerNameInTable = (preName: string, newName: string) => {
        let updatedDataForTable = dataForTable;
        let anyUpdates = false;

        dataForTable.forEach((element, row) => {
            if (element[2] === preName) {
                updatedDataForTable[row]
                    = [element[0], element[1], newName, element[3]];
                anyUpdates = true;
            }
        });

        if (anyUpdates)
            setDataForTable(updatedDataForTable);
    }

    const updateTableForValue = (value: string, intent: Intent, rowIndex: number, columnIndex: number) => {
        if (dataForTable[rowIndex][columnIndex] !== value) {
            let updatedDataForTable = dataForTable;
            updatedDataForTable[rowIndex][columnIndex] = value;
            setDataForTable(updatedDataForTable);
        }
        if (cellIntents[rowIndex][columnIndex] !== intent) {
            let updatedCellIntents = cellIntents;
            updatedCellIntents[rowIndex][columnIndex] = intent;
            setCellIntents(updatedCellIntents);
        }
    };

    const testCanSubmitData = () => {
        cellIntents.forEach(x => {
            x.forEach(cell => {
                if (cell !== Intent.NONE) return false;
            });
        });

        const totalArmies = dataForTable.map(x => x[3]).reduce((x, y) => x + parseInt(y), 0);

        if (totalArmies !== 80)
            return false;

        return true;
    };

    const cellRenderer = (rowIndex: number, columnIndex: number) => {
        if (columnIndex === 2) {
            return <EditableCell value={dataForTable[rowIndex][columnIndex]}
                onChange={changePlayer} onCancel={changePlayer} onConfirm={changePlayer}
                intent={cellIntents[rowIndex][columnIndex]}
                rowIndex={rowIndex} columnIndex={columnIndex}></EditableCell>
        }

        if (columnIndex === 3) {
            return <EditableCell value={dataForTable[rowIndex][columnIndex]}
                onChange={changeArmies} onCancel={changeArmies}
                onConfirm={changeArmies} intent={cellIntents[rowIndex][columnIndex]}
                rowIndex={rowIndex} columnIndex={columnIndex}></EditableCell>
        }

        return (<Cell>{`${dataForTable[rowIndex][columnIndex]}`}</Cell>);
    }

    const columns = ["Continent", "Territory", "Owner", "AdditionalArmiesToPlace"].map(
        (element: string, index: number) => {
            return <Column key={index} name={element} cellRenderer={cellRenderer} />;
        }
    );

    const submitData = () => {
        var results: TerritoryState[] = [];
        for (var i = 0; i < dataForTable.length; i++) {
            var myData = {
                territoryName: dataForTable[i][1],
                playerName: dataForTable[i][2],
                armies: parseInt(dataForTable[i][3])
            };
            results.push(myData);
        }

        var players: [Player, Player] = [
            { name: player1Name, displayName: player1Name },
            { name: player2Name, displayName: player2Name }];

        props.onStartGame(results, players);
    };

    const player1NameUpdated: ChangeEventHandler<HTMLInputElement> = function (onChangeArgs: ChangeEvent<HTMLInputElement>) {
        const newValue = onChangeArgs.target.value;
        attemptToUpdatePlayerNameInTable(player1Name, newValue);
        setPlayer1Name(newValue);
    };

    const player2NameUpdated: ChangeEventHandler<HTMLInputElement> = function (onChangeArgs: ChangeEvent<HTMLInputElement>) {
        const newValue = onChangeArgs.target.value;
        attemptToUpdatePlayerNameInTable(player2Name, newValue);
        setPlayer2Name(newValue);
    };

    const changeArmies = (value: string, rowIndex: number | undefined, columnIndex: number | undefined) => {
        if (rowIndex === undefined || columnIndex === undefined)
            return;

        let intent =
            isNaN(parseInt(value))
                ? Intent.DANGER : Intent.NONE;

        updateTableForValue(value, intent, rowIndex, columnIndex);
        setCanSubmitData(testCanSubmitData());
    };

    const changePlayer = (value: string, rowIndex: number | undefined, columnIndex: number | undefined) => {
        if (rowIndex === undefined || columnIndex === undefined)
            return;

        let intent = (value === player1Name || value === player2Name)
            ? Intent.NONE : Intent.DANGER;

        updateTableForValue(value, intent, rowIndex, columnIndex);
        setCanSubmitData(testCanSubmitData());
    };


    return (
        <>
            <Card>
                <H3>Player Names</H3>
                <InputGroup
                    disabled={false}
                    large={true}
                    value={player1Name}
                    type="text"
                    onChange={player1NameUpdated}
                />
                <InputGroup
                    disabled={false}
                    large={true}
                    value={player2Name}
                    type="text"
                    onChange={player2NameUpdated}
                />
            </Card>
            <Card>
                <H3>Territory Select</H3>
                <Table2 numRows={dataForTable.length}>
                    {columns}
                </Table2>
                <Button onClick={submitData} disabled={canSubmitData === false}>Start Game</Button>
                <Button onClick={setRandomDataSet}>Randomize Selection</Button>
            </Card>
        </>
    );



};

export default TerritorySelect;
