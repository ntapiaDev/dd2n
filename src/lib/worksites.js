import { sortItems } from "$lib/loots";

export const checkResources = (bank, resources, ap, mustReload, reload) => {
    if (mustReload && reload) resources = resources.filter(r => r.item.reload === true);
    for (let resource of resources) {
        if (getQuantity(bank, resource) < resource.quantity * (resource.item.reload ? ap : 1)) return false;
    }
    return true;
}

export const getDefense = (completed, reload, worksites) => {
    let defense = 0;
    let rechargeable = 0;
    let temporary = 0;
    for (let complete of completed) {
        for (let group of worksites) {
            for (let worksite of group.reduction) {
                if (worksite.id === complete) {
                    const ap = reload.find(w => w.id === worksite.id)?.ap ?? 1;
                    defense += worksite.defense * ap;
                    if (worksite.reload) rechargeable += worksite.defense * ap;
                    if (worksite.temporary) temporary += worksite.defense;
                } 
            }
        }
    }
    return [defense, rechargeable, temporary];
}

export const getQuantity = (bank, resource) => {
    let quantity = 0;
    for (let item of bank) {
        if (item.id === resource.item.id) quantity += item.quantity;
    }
    return quantity;
}

export const isBlocked = (child, completed, worksites) => {
    const rarities = ['commun', 'inhabituel', 'rare', 'épique'];
    const group = worksites.find(g => g.reduction.some(w => w.id === child.id));
    const previous = group.reduction.filter(w => w.defense < child.defense && rarities.indexOf(w.rarity) <= rarities.indexOf(child.rarity)).map(w => w.id);
    previous.push(group.group);
    return !previous.every(w => completed.includes(w));
}

export const updateBank = (resources, bank, ap, mustReload, reload, plus = false) => {
    let items = [];
    if (mustReload && reload) resources = resources.filter(r => r.item.reload === true);
    for (let resource of resources) {
        let quantity = resource.quantity * (resource.item.reload ? ap : 1);
        while (quantity > 0 && !resource.item.unique) {
            let item = {...sortItems(bank).find(i => i.id === resource.item.id && i.quantity > 0 && (plus ? i.plus === resource.item.plus : true))};
            sortItems(bank).find(i => i.id === resource.item.id && i.quantity > 0 && (plus ? i.plus === resource.item.plus : true)).quantity -= quantity;
            quantity -= item.quantity;
            if (quantity < 0) item.quantity += quantity;
            items.push(item)
        }
    }
    return [bank, items];
}
