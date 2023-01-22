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
    const itemList = getItems(danger);
    let pool = [];
    for (let item of itemList) {
        if (!item.unique || !uniques.includes(item.id)) {
            const type = item.type === 'resource' ? 10 :
                item.type === 'ammunition' ? 15 :
                item.type === 'explosive' ? 5 :
                ['food', 'drink'].includes(item.type) ? 3 :
                ['drug', 'weapon', 'armour'].includes(item.type) ? 2 : 1;
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

export const handleSearch = (items, pool, type) => {
    let loots = [];
    let uniques = [];
    const hasPlus = (foundItem) => {
        if (['weapon', 'armour'].includes(foundItem.type)) {
            const random = Math.round(Math.random() * 100) / 100;
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

export const sortItems = (items) => {
    const order = ['food', 'drink', 'drug', 'weapon', 'ammunition', 'explosive', 'armour', 'resource', 'blueprint', 'misc'];
    return items = items.sort((a, b) => order.indexOf(a.type) > order.indexOf(b.type) ? 1
    : order.indexOf(a.type) < order.indexOf(b.type) ? -1 
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
