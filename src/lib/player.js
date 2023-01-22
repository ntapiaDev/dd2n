export const checkHT = (hunger, thirst) => {
    let warning = false;
    if (hunger > 1) hunger--;
    if (thirst > 1) thirst--;
    if (hunger === 1 && thirst === 1) warning = 'both';
    else if (hunger === 1) warning = 'hunger';
    else if (thirst === 1) warning = 'thirst';
    return { hunger, thirst, warning };
}

export const getDefense = (slots) => (slots.A1.defense ?? 0) + (slots.A2.defense ?? 0) + (slots.A3.defense ?? 0);
