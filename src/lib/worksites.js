export const checkResources = (bank, resources) => {
    for (let resource of resources) {
        if ((bank.find(i => i.id === resource.item.id)?.quantity ?? 0) < resource.quantity) return false;
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
