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

export const getLevel = (xp) => {
    let i = 0;
    let xpTab = { 0: 0 };
    while (xpTab[i] <= xp) {
        i++;
        xpTab[i] = xpTab[i - 1] + i * 100;
    }
    for (let key in xpTab)
        if (xpTab[key] > xp) {
            let level = key - 1;

            let current = xp - xpTab[level];
            let total = xpTab[key] - xpTab[level];
            let progress = Math.floor((current / total) * 100);

            return { level, progress };
    }
}

export const getPAMax = (xp) => 100 + getLevel(xp).level;

export const levelUp = (totalXp, xpGained) => {
    return { up: getLevel(totalXp).level < getLevel(totalXp + xpGained).level, level: getLevel(totalXp + xpGained).level }
}
