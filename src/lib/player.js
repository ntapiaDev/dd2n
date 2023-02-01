export const checkHT = (hunger, thirst, value) => {
    let warning = false;
    if (hunger > value) hunger -= value;
    else hunger = 1;
    if (thirst > value) thirst -= value;
    else thirst = 1;
    if (hunger === 1 && thirst === 1) warning = 'both';
    else if (hunger === 1) warning = 'hunger';
    else if (thirst === 1) warning = 'thirst';
    return { hunger, thirst, warning };
}

export const getDefense = (slots) => (slots.A1.defense ?? 0) + (slots.A2.defense ?? 0) + (slots.A3.defense ?? 0);

export const getDefenseAll = (slots, players) => {
    let defense = 0;
    for (let slot of slots) {
        if (players.includes(slot.username)) defense += getDefense(slot);
    }
    return defense;
}
