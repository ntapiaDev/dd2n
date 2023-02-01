import { sortItems } from "$lib/loots";

export const checkResources = (bank, resources) => {
    for (let resource of resources) {
        if (getQuantity(bank, resource) < resource.quantity) return false;
    }
    return true;
}

export const getDefense = (completed, worksites) => {
    let defense = 0;
    let temporary = 0;
    for (let complete of completed) {
        for (let group of worksites) {
            for (let worksite of group.reduction) {
                if (worksite.id === complete) {
                    defense += worksite.defense;
                    if (worksite.temporary) temporary += worksite.defense;
                } 
            }
        }
    }
    return [defense, temporary];
}

export const getQuantity = (bank, resource) => {
    let quantity = 0;
    for (let item of bank) {
        if (item.id === resource.item.id) quantity += item.quantity;
    }
    return quantity;
}

export const isBlocked = (child, completed, worksites) => {
    const group = worksites.find(g => g.reduction.some(w => w.id === child.id));
    const previous = group.reduction.filter(w => w.defense < child.defense).map(w => w.id);
    previous.push(group.group);
    return !previous.every(w => completed.includes(w));
}

export const updateBank = (resources, bank) => {
    let items = [];
    for (let resource of resources) {
        let quantity = resource.quantity;
        while (quantity > 0 && !resource.item.unique) {
            let item = {...sortItems(bank).find(i => i.id === resource.item.id && i.quantity > 0)};
            sortItems(bank).find(i => i.id === resource.item.id && i.quantity > 0).quantity -= quantity;
            quantity -= item.quantity;
            if (quantity < 0) item.quantity += quantity;
            items.push(item)
        }
    }
    return [bank, items];
}
