const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']; //16 * 16 = 256 cases max

export const sortItems = (items) => {
    const order = ['food', 'drink', 'drug', 'weapon', 'ammunition', 'explosive', 'armour', 'resource', 'blueprint', 'misc'];
    return items = items.sort((a, b) => order.indexOf(a.type) > order.indexOf(b.type) ? 1
    : order.indexOf(a.type) < order.indexOf(b.type) ? -1 
    // Si légendaire utilisé, refaire un tableau de tri par qualité... (/!\ Noms en français)
    : a.rarity > b.rarity ? 1 
    : a.rarity < b.rarity ? -1 
    : a.attack > b.attack ? 1 
    : a.attack < b.attack ? -1 
    : a.defense > b.defense ? 1 
    : a.defense < b.defense ? -1 
    : a.description > b.description ? 1 
    : a.description < b.description ? -1 
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
    // Importer tout simplement depuis le layout avec un find... :/
    const inner = ['F6', 'F7', 'F8', 'F9', 'F10', 'G6', 'G7', 'G8', 'G9', 'G10', 'H6', 'H7', 'H9', 'H10', 'I6', 'I7', 'I8', 'I9', 'I10', 'J6', 'J7', 'J8', 'J9', 'J10'];
    const middle = ['C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10', 'E11', 'E12', 'E13', 'F3', 'F4', 'F5', 'F11', 'F12', 'F13', 'G3', 'G4', 'G5', 'G11', 'G12', 'G13', 'H3', 'H4', 'H5', 'H11', 'H12', 'H13', 'I3', 'I4', 'I5', 'I11', 'I12', 'I13', 'J3', 'J4', 'J5', 'J11', 'J12', 'J13', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10', 'K11', 'K12', 'K13', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12', 'M13'];
    const outer = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'C1', 'C2', 'C14', 'C15', 'D1', 'D2', 'D14', 'D15','E1', 'E2', 'E14', 'E15','F1', 'F2', 'F14', 'F15','G1', 'G2', 'G14', 'G15','H1', 'H2', 'H14', 'H15','I1', 'I2', 'I14', 'I15','J1', 'J2', 'J14', 'J15','K1', 'K2', 'K14', 'K15','L1', 'L2', 'L14', 'L15','M1', 'M2', 'M14', 'M15', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9', 'N10', 'N11', 'N12', 'N13', 'N14', 'N15', 'O1', 'O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10', 'O11', 'O12', 'O13', 'O14', 'O15'];
    
    const getCoord = (array) => {
        const coor = array[Math.floor(Math.random() * array.length)];        
        array.splice(array.indexOf(coor), 1);
        return coor;
    }

    const buildings = {};
    buildings[getCoord(inner)] = {type: 'Une épicerie', code: 'b1', searchedBy: [], empty: false};
    buildings[getCoord(middle)] = {type: 'Un entrepot de bricolage', code: 'b2', searchedBy: [], empty: false};
    buildings[getCoord(middle)] = {type: 'Une pharmacie', code: 'b3', searchedBy: [], empty: false};
    buildings[getCoord(outer)] = {type: 'Un magasin de matériel informatique', code: 'b4', searchedBy: [], empty: false};
    buildings[getCoord(outer)] = {type: 'Un commissariat de police', code: 'b5', searchedBy: [], empty: false};

    return buildings;
}
