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
