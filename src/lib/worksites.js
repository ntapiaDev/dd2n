export const checkResources = (bank, resources) => {
    for (let resource of resources) {
        if (getQuantity(bank, resource) < resource.quantity) return false;
    }
    return true;
}

export const getDefense = (completed, worksites) => {
    let defense = 0;
    for (let complete of completed) {
        for (let group of worksites) {
            for (let worksite of group.reduction) {
                if (worksite.id === complete) defense += worksite.defense;
            }
        }
    }
    return defense;
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
