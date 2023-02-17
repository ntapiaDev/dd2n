import { ammunition, armour, bag, blueprint, commun, drink, drug, explosive, food, inhabituel, loot_building, loot_search, plus_four, plus_one, plus_tree, plus_two, quantity_cache, quant_ammo, quant_items, rare, resource, resource_cache, weapon, épique } from "./config";

export const findOrigin = (bag1, bag2, inventory, uuid) => {
    let origin = '';
    if (bag1.find(i => i.uuid === uuid)) origin = 'bag1';
    else if (bag2.find(i => i.uuid === uuid)) origin = 'bag2';
    else if (inventory.find(i => i.uuid === uuid)) origin = 'inventory';
    else return { origin: false, target: false };
    const target = origin === 'inventory' ? inventory : origin === 'bag1' ? bag1 : bag2;
    return { origin, target }
}

export const getBlueprints = (encampment, recipes, worksites, advance) => {
    const blueprints = [];
    if (advance === 'none') return blueprints;
    if (encampment.workshop.unlocked && advance === 'all') {
        for (let recipe of recipes) {
            if (!encampment.workshop.recipes.includes(recipe.left.id)) {
                const blueprint = {
                    credit: 'Freepik',
                    description: `Recette: ${recipe.left.name}`,
                    icon: 'workshop',
                    id: `${recipe.left.id}`,
                    rarity: `${recipe.left.rarity}`,
                    recipe_id: `${recipe.left.id}`,
                    type: 'blueprint',
                    unique: true
                }
                blueprints.push(blueprint);
            }
        }
    }
    const models = [];
    for (let group of worksites) {
        if (!group.group || encampment.worksites.completed.includes(group.group) || encampment.worksites.unlocked.some(w => w.id === group.group))
            for (let worksite of group.reduction)
                if (!encampment.worksites.completed.includes(worksite.id) && !encampment.worksites.unlocked.some(w => w.id === worksite.id))
                    if (advance === 'all' || worksite.advance === advance) models.push(worksite)
    }
    for (let worksite of models) {
        const blueprint = {
            credit: 'wanicon',
            description: `Plan: ${worksite.name}`,
            icon: 'worksite',
            id: `${worksite.id}`,
            rarity: `${worksite.rarity}`,
            type: 'blueprint',
            unique: true,
            worksite_id: `${worksite.id}`
        }
        blueprints.push(blueprint);
    }
    return blueprints;
}

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
            const type = item.type === 'food' ? food :
            item.type === 'drink' ? drink :
            item.type === 'drug' ? drug :
            item.type === 'weapon' ? weapon :
            item.type === 'ammunition' ? ammunition :
            item.type === 'explosive' ? explosive :
            item.type === 'armour' ? armour :
            item.type === 'bag' ? bag :
            item.type === 'resource' ? resource : blueprint;
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

export const handleBag = (item, user) => {
    const slots = user.slots;
    if (['ammunition', 'explosive'].includes(item.type) && slots[item.slot].id === item.id && slots[item.slot].uuid !== item.uuid) {
        slots[item.slot].quantity += item.quantity;
        return { destination: 'slots', target: slots }
    }
    const b1 = user.bag1;
    const b2 = user.bag2;
    const inventory = user.inventory;
    if (['ammunition', 'explosive'].includes(item.type)) {
        if (b1.find(i => i.id === item.id)) {
            b1.find(i => i.id === item.id).quantity += item.quantity;
            return { destination: 'bag1', target: b1 }
        } else if (inventory.find(i => i.id === item.id)) {
            inventory.find(i => i.id === item.id).quantity += item.quantity;
            return { destination: 'inventory', target: inventory }
        } else if (b2.find(i => i.id === item.id)) {
            b2.find(i => i.id === item.id).quantity += item.quantity;
            return { destination: 'bag2', target: b2 }
        }
    }
    const type = item.type;
    let destination = 'test';
    if (inventory.length === 10) {
        if (!user.slots.B1 || b1.length === user.slots.B1.capacity) {
            if (!user.slots.B2 || b2.length === user.slots.B2.capacity) return { destination: 'full', target: [] }
            else destination = 'bag2';
        } else if (type !== 'resource' || !user.slots.B2 || b2.length === user.slots.B2.capacity) destination = 'bag1';
        else destination = 'bag2';
    } else if (!user.slots.B1 && !user.slots.B2 || ['food', 'drink', 'drug', 'blueprint'].includes(type)) destination = 'inventory';
    else if (user.slots.B1 && b1.length < user.slots.B1.capacity && ['weapon', 'ammunition', 'explosive', 'armour', 'bag'].includes(type)) destination = 'bag1';
    else if (user.slots.B2 && b2.length < user.slots.B2.capacity && type === 'resource') destination = 'bag2';
    else destination = 'inventory';
    if (!['ammunition', 'explosive'].includes(type)) item.quantity = 1;
    item.uuid = crypto.randomUUID();
    const target = destination === 'inventory' ? inventory : destination === 'bag1' ? b1 : b2; 
    target.push(item);
    return { destination, target }
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
        if (['bag', 'weapon', 'armour'].includes(foundItem.type)) {
            const random = Math.round(Math.random() * 100) / 100;
            foundItem.plus =
                random === plus_four ? 4 :
                random > plus_tree ? 3 :
                random > plus_two ? 2 :
                random > plus_one ? 1 : 0
            if (foundItem.type === 'bag') foundItem.capacity += foundItem.plus;
            else if (foundItem.type === 'weapon') foundItem.attack += foundItem.plus;
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
        if (!['bag', 'weapon', 'armour'].includes(item.type)) items.find(i => i.id === item.id).quantity += item.quantity;
        else if (['bag', 'armour'].includes(item.type) && items.find(i => i.id === item.id && i.plus === item.plus)) items.find(i => i.id === item.id && i.plus === item.plus).quantity += item.quantity;
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
    const type = ['food', 'drink', 'drug', 'weapon', 'ammunition', 'explosive', 'armour', 'bag', 'resource', 'blueprint', 'misc'];
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
    : a.capacity > b.capacity ? 1 
    : a.capacity < b.capacity ? -1 
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
