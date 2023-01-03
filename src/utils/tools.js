export const sortItems = (items) => {
    const order = ['food', 'drink', 'drug', 'weapon', 'armour', 'resource', 'blueprint'];
    return items = items.sort((a, b) => order.indexOf(a.type) > order.indexOf(b.type) ? 1 : order.indexOf(a.type) < order.indexOf(b.type) ? -1 : 0);
}
