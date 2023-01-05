const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']; //16 * 16 = 256 cases max

export const sortItems = (items) => {
    const order = ['food', 'drink', 'drug', 'weapon', 'ammunition', 'armour', 'resource', 'blueprint', 'misc'];
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
