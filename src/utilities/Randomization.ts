export function shuffle(array: any[]) : any[] {
    return array.map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export function rollBattleDice(attackers: number, defenders: number)  : [number, number] {
    const attackerAdvantage = attackers - defenders;
    const outcome = Math.floor(Math.random() * attackerAdvantage);
    return [Math.max(attackers - outcome, 0), Math.max(defenders - outcome, 0)];
}