const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']; //16 * 16 = 256 cases max

// Importer tout simplement depuis le layout avec un find... :/
const inner = ['F6', 'F7', 'F8', 'F9', 'F10', 'G6', 'G7', 'G8', 'G9', 'G10', 'H6', 'H7', 'H9', 'H10', 'I6', 'I7', 'I8', 'I9', 'I10', 'J6', 'J7', 'J8', 'J9', 'J10'];
const middle = ['C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13', 'F3', 'F4', 'F5', 'F11', 'F12', 'F13', 'G3', 'G4', 'G5', 'G11', 'G12', 'G13', 'H3', 'H4', 'H5', 'H11', 'H12', 'H13', 'I3', 'I4', 'I5', 'I11', 'I12', 'I13', 'J3', 'J4', 'J5', 'J11', 'J12', 'J13', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10', 'K11', 'K12', 'K13', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13'];
const outer = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'C1', 'C2', 'C14', 'C15', 'D1', 'D2', 'D14', 'D15','E1', 'E2', 'E14', 'E15','F1', 'F2', 'F14', 'F15','G1', 'G2', 'G14', 'G15','H1', 'H2', 'H14', 'H15','I1', 'I2', 'I14', 'I15','J1', 'J2', 'J14', 'J15','K1', 'K2', 'K14', 'K15','L1', 'L2', 'L14', 'L15','M1', 'M2', 'M14', 'M15', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10', 'N11', 'N12', 'N13', 'N14', 'N15', 'O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10', 'O11', 'O12', 'O13', 'O14', 'O15'];

// export const danger = (coordinate) => inner.includes(coordinate) ? 1 : (middle.includes(coordinate) ? 2 : 3);

const getCoord = (array) => {
    const coor = array[Math.floor(Math.random() * array.length)];        
    array.splice(array.indexOf(coor), 1);
    return coor;
}

export const getDistance = (location, target) => {
    const { i: li, j: lj} = getIJ(location);
    const { i: ti, j: tj} = getIJ(target);
    return Math.abs(li - ti) + Math.abs(lj - tj);
}

export const getIJ = (coordinate) => {
    const i = letters.indexOf(coordinate[0]);
    const j = coordinate.substring(1) - 1;
    return { i, j };
}

export const sortItems = (items) => {
    const order = ['food', 'drink', 'drug', 'weapon', 'ammunition', 'explosive', 'armour', 'resource', 'blueprint', 'misc'];
    return items = items.sort((a, b) => order.indexOf(a.type) > order.indexOf(b.type) ? 1
    : order.indexOf(a.type) < order.indexOf(b.type) ? -1 
    // Si légendaire utilisé, refaire un tableau de tri par qualité... (/!\ Noms en français)
    : a.rarity > b.rarity ? 1 
    : a.rarity < b.rarity ? -1 
    : a.type === 'weapon' && (a.attack - a.plus) > (b.attack - b.plus) ? 1 
    : a.type === 'weapon' && (a.attack - a.plus) < (b.attack - b.plus) ? -1 
    : a.type === 'armour' && (a.defense - a.plus) > (b.defense - b.plus) ? 1 
    : a.type === 'armour' && (a.defense - a.plus) < (b.defense - b.plus) ? -1 
    : a.slot > b.slot ? 1 
    : a.slot < b.slot ? -1 
    : a.value > b.value ? 1 
    : a.value < b.value ? -1 
    : a.description > b.description ? 1 
    : a.description < b.description ? -1 
    : a.plus > b.plus ? 1 
    : a.plus < b.plus ? -1 
    : a.durability > b.durability ? 1 
    : a.durability < b.durability ? -1 
    : 0);
}

// Fusionner les deux en une + letters??
// Faire avec i et j au lieu des lettres
export const canTravel = (location, target, border) => {
    const distance = Math.abs(letters.indexOf(location[0]) - letters.indexOf(target[0])) + Math.abs(target.substring(1) - location.substring(1)) === 1;
    if (distance) return !border.includes(direction(location, target));
    return distance;
}
const direction = (location, target) => {
    if (location[0] === target[0]) {
        return location.substring(1) - target.substring(1) > 0 ? 2 : 4;
    } else if (target.substring(1) === location.substring(1)) {
        return letters.indexOf(target[0]) - letters.indexOf(location[0]) > 0 ? 1 : 3;
    }
}

export const getBuildings = () => {  
    const buildings = {};
    buildings[getCoord(inner)] = { type: 'Une épicerie', code: 'b1', searchedBy: [], empty: false };
    buildings[getCoord(middle)] = { type: 'Un entrepot de bricolage', code: 'b2', searchedBy: [], empty: false };
    buildings[getCoord(middle)] = { type: 'Une pharmacie', code: 'b3', searchedBy: [], empty: false };
    buildings[getCoord(outer)] = { type: 'Un magasin de matériel informatique', code: 'b4', searchedBy: [], empty: false };
    buildings[getCoord(outer)] = { type: 'Un commissariat de police', code: 'b5', searchedBy: [], empty: false };
    return buildings;
}

export const getTunnel = () => [getCoord(middle), getCoord(outer)];

export const checkHT = (hunger, thirst) => {
    let warning = false;
    if (hunger > 1) hunger--;
    if (thirst > 1) thirst--;
    if (hunger === 1 && thirst === 1) warning = 'both';
    else if (hunger === 1) warning = 'hunger';
    else if (thirst === 1) warning = 'thirst';
    return { hunger, thirst, warning };
}

export const getRandomName = () => {
    const start = ['La caverne', 'La cité', 'La demeure', 'La fôret', 'La montagne', 'La plaine', 'La tanière', 'Le hameaux', 'Le havre', 'Le lac', 'Le refuge', 'Le terrier'];
    const middle = ['des alpagas', 'des loups', 'des cochons', 'des escargots', 'des nains', 'des lapins', 'des orcs', 'des lézards', 'des bandits', 'des chevaliers', 'des voleurs', 'des princes'];
    const end = ['mutants', 'masqués', 'alcooliques', 'malades', 'dépressifs', 'hypocondriaques', 'claustrophobes', 'enragés'];
    const getRandom = (array) => array[Math.floor(Math.random() * array.length)];
    return `${getRandom(start)} ${getRandom(middle)} ${getRandom(end)}`
}

export const getDefense = (slots) => (slots.A1.defense ?? 0) + (slots.A2.defense ?? 0) + (slots.A3.defense ?? 0);

export const handleStack = (items, foundItem) => {
    if (items.find(i => i.id === foundItem.id)) {
        if (!['weapon', 'armour'].includes(foundItem.type)) items.find(i => i.id === foundItem.id).quantity += foundItem.quantity;
        else if (foundItem.type === 'armour' && items.find(i => i.id === foundItem.id && i.plus === foundItem.plus)) items.find(i => i.id === foundItem.id && i.plus === foundItem.plus).quantity += foundItem.quantity;
        else if (foundItem.type === 'weapon' && items.find(i => i.id === foundItem.id && i.plus === foundItem.plus && i.durability === foundItem.durability)) items.find(i => i.id === foundItem.id && i.plus === foundItem.plus && i.durability === foundItem.durability).quantity += foundItem.quantity;
        else items.push(foundItem);
    }
    else {
        items.push(foundItem);
    }
    return items;
}

export const handlePlus = (loots) => {
    let plus = { one: 0, two: 0, tree: 0, four: 0};
    for (let loot of (loots)) {
        if (loot.plus === 1) plus.one++;
        else if (loot.plus === 2) plus.two++;
        else if (loot.plus === 3) plus.tree++;
        else if (loot.plus === 4) plus.four++;
    }
    return plus;
}

export const hasPlus = (foundItem) => {
    if (['weapon', 'armour'].includes(foundItem.type)) {
        const random = Math.random();
        foundItem.plus =
            random === 1 ? 4 :
            random > 0.95 ? 3 :
            random > 0.90 ? 2 :
            random > 0.75 ? 1 : 0
        if (foundItem.type === 'weapon') foundItem.attack += foundItem.plus;
        else if (foundItem.type === 'armour') foundItem.defense += foundItem.plus;
    }
    return foundItem;
}

export const getPool = (items, danger, uniques) => {
    const getItems = (danger) => {
        if (danger === 0) return items;
        else if (danger === 1) {
            return items.filter(i => i.type !== 'misc' && ['commun', 'inhabituel'].includes(i.rarity));
        } else if (danger === 2) {
            return items.filter(i => i.type !== 'misc' && ['commun', 'inhabituel', 'rare'].includes(i.rarity));
        } else if (danger === 3) {
            return items.filter(i => i.type !== 'misc' && ['commun', 'inhabituel', 'rare', 'épique'].includes(i.rarity));
        }
    }
    const itemPool = getItems(danger);
    let pool = [];
    for (let item of itemPool) {
        if (!item.unique || !uniques.includes(item.id)) {
            // Probabilité en fonction du type
            const type = item.type === 'resource' ? 10 :
                item.type === 'ammunition' ? 15 :
                item.type === 'explosive' ? 5 :
                ['food', 'drink'].includes(item.type) ? 3 :
                ['drug', 'weapon', 'armour'].includes(item.type) ? 2 : 1;
            // Probabilité en fonction de la rareté
            const rarity = item.rarity === 'commun' ? 5 :
                item.rarity === 'inhabituel' ? 3 :
                item.rarity === 'rare' ? 2 : 1;
            for (let i = 0; i < (type * rarity); i++) {
                pool.push(item);
            }
        }
    }
    return pool;
}

export const handleSearch = (items, pool, type) => {
    let loots = [];
    let uniques = [];
    for (let i = 0; i < (type === 'building' ? (Math.ceil(Math.random() * 4) + 1) : Math.ceil(Math.random() * 3)); i++) {
        let foundItem = pool[Math.floor(Math.random() * pool.length)];
        pool = pool.filter(i => i.id !== foundItem.id);
        if (foundItem.slot === "W1") foundItem.durability = Math.ceil(foundItem.durabilityMax * (50 + Math.round(Math.random() * 50)) / 100);
        foundItem.uuid = crypto.randomUUID();
        foundItem = hasPlus(foundItem);
        if (foundItem.type === 'ammunition') foundItem.quantity = Math.ceil(Math.random() * 10);
        else foundItem.quantity = 1;
        items = handleStack(items, foundItem); 
        if (foundItem.unique) uniques.push(foundItem.id);
        loots.push(foundItem);
    }
    return { items, loots, uniques };
}

export const getItem = (items, uuid, stack) => {
    for (let item of items) {
        if (item.uuid === uuid) {
            if (stack && item.quantity > 1 && !['ammunition', 'explosive'].includes(item.type)) {
                item.quantity -= 1;
            }
            else items.splice(items.indexOf(item), 1);
            return {item: {...item}, items};
        }
    }
}
