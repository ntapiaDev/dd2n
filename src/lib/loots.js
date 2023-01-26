import { ammunition, blueprint, commun, drug_weapon_armour, explosive, food_drink, inhabituel, loot_building, loot_search, plus_four, plus_one, plus_tree, plus_two, quantity_cache, quant_ammo, quant_items, rare, resource, resource_cache, épique } from "./config";

export const getItem = (items, uuid, stack) => {
    for (let item of items) {
        if (item.uuid === uuid) {
            if (stack && item.quantity > 1 && !['ammunition', 'explosive'].includes(item.type)) {
                item.quantity -= 1;
            }
            else items.splice(items.indexOf(item), 1);
            return { item: { ...item } };
        }
    }
}

export const getPool = (items, danger, uniques) => {
    const getItems = (danger) => {
        if (danger === 0) return items;
        else if (danger === 1) {
            return items.filter(i => ['commun', 'inhabituel'].includes(i.rarity));
        } else if (danger === 2) {
            return items.filter(i => ['commun', 'inhabituel', 'rare'].includes(i.rarity));
        } else if (danger === 3) {
            return items.filter(i => ['commun', 'inhabituel', 'rare', 'épique'].includes(i.rarity));
        }
    }
    const itemList = getItems(danger);
    let pool = [];
    for (let item of itemList) {
        if (!item.unique || !uniques.includes(item.id)) {
            const type = item.type === 'resource' ? resource :
                item.type === 'ammunition' ? ammunition :
                item.type === 'explosive' ? explosive :
                ['food', 'drink'].includes(item.type) ? food_drink :
                ['drug', 'weapon', 'armour'].includes(item.type) ? drug_weapon_armour : blueprint;
            const rarity = item.rarity === 'commun' ? commun :
                item.rarity === 'inhabituel' ? inhabituel :
                item.rarity === 'rare' ? rare : épique;
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
    let cache = [];
    let loots = [];
    let uniques = [];
    const hasPlus = (foundItem) => {
        if (['weapon', 'armour'].includes(foundItem.type)) {
            const random = Math.round(Math.random() * 100) / 100;
            foundItem.plus =
                random === plus_four ? 4 :
                random > plus_tree ? 3 :
                random > plus_two ? 2 :
                random > plus_one ? 1 : 0
            if (foundItem.type === 'weapon') foundItem.attack += foundItem.plus;
            else if (foundItem.type === 'armour') foundItem.defense += foundItem.plus;
        }
        return foundItem;
    }
    for (let i = 0; i < (type === 'building' ? loot_building() : loot_search()); i++) {
        let foundItem = pool[Math.floor(Math.random() * pool.length)];
        pool = pool.filter(i => i.id !== foundItem.id);
        if (foundItem.slot === "W1") foundItem.durability = Math.ceil(foundItem.durabilityMax * (50 + Math.round(Math.random() * 50)) / 100);
        foundItem.uuid = crypto.randomUUID();
        foundItem = hasPlus(foundItem);
        if (foundItem.type === 'ammunition') foundItem.quantity = quant_ammo();
        else foundItem.quantity = quant_items;
        items = handleStack(items, {...foundItem});
        if (foundItem.type === 'resource' && !foundItem.unique && Math.random() > resource_cache) {
            let cacheItem = {...foundItem};
            cacheItem.quantity = quantity_cache();
            items = handleStack(items, {...cacheItem});
            cache.push(cacheItem);
        }
        if (foundItem.unique) uniques.push(foundItem.id);
        loots.push(foundItem);
    }
    return { cache, items, loots, uniques };
}

export const handleStack = (items, item) => {
    if (items.find(i => i.id === item.id)) {
        if (!['weapon', 'armour'].includes(item.type)) items.find(i => i.id === item.id).quantity += item.quantity;
        else if (item.type === 'armour' && items.find(i => i.id === item.id && i.plus === item.plus)) items.find(i => i.id === item.id && i.plus === item.plus).quantity += item.quantity;
        else if (item.type === 'weapon' && items.find(i => i.id === item.id && i.plus === item.plus && i.durability === item.durability)) items.find(i => i.id === item.id && i.plus === item.plus && i.durability === item.durability).quantity += item.quantity;
        else items.push(item);
    }
    else {
        items.push(item);
    }
    return items;
}

export const sortItems = (items) => {
    const rarity = ['commun', 'inhabituel', 'rare', 'épique', 'légendaire'];
    const type = ['food', 'drink', 'drug', 'weapon', 'ammunition', 'explosive', 'armour', 'resource', 'blueprint', 'misc'];
    return items = items.sort((a, b) => type.indexOf(a.type) > type.indexOf(b.type) ? 1
    : type.indexOf(a.type) < type.indexOf(b.type) ? -1 
    : rarity.indexOf(a.rarity) > rarity.indexOf(b.rarity) ? 1
    : rarity.indexOf(a.rarity) < rarity.indexOf(b.rarity) ? -1 
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
