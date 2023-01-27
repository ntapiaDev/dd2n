export const checkResources = (bank, resources) => {
    for (let resource of resources) {
        if ((bank.find(i => i.id === resource.item.id)?.quantity ?? 0) < resource.quantity) return false;
    }
    return true;
}
