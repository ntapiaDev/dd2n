import { fail, redirect } from "@sveltejs/kit";
import { canTravel, getIJ } from '../../../utils/tools';
import { getItems, getItemsByCode, moveItem } from '../../../utils/items';
import { addLog, deleteLogs, getLogsByCoordinate } from "../../../utils/logs";
import { generateMap, getAttack, getMap, getMapTunnel, getNextDay, getSearch, getTravel, pushThrough } from "../../../utils/maps";

export async function load({ locals }) {
    const map = await getMap(locals.user.id, locals.rethinkdb);
    const logs = await getLogsByCoordinate(locals.user.id, locals.user.location, locals.rethinkdb);
    return { map, logs };
}

const attack = async ({ locals, request }) => {
    if (locals.user.ap === 0) return fail(400, { exhausted: true });
    const data = await request.formData();
    const id = data.get('id');
    const li = locals.user.i;
    const lj = locals.user.j;
    const slots = locals.user.slots;
    const item = Object.entries(slots).find(slot => slot.find(i => i.id === id))?.find(i => i.id === id);
    // Vérification que l'objet existe (prévoir un cas d'erreur? message flash??)
    if (item) {
        const map = await getMap(locals.user.id, locals.rethinkdb);
        if (map.rows[li][lj].zombies === 0) return fail(400, { zombies: true });
        // On vérifie que le type de munitions correspond
        if (item.weapon && item.weapon !== slots.W3.weapon) return fail(400, { ammo: true });
        let wound = locals.user.wound;
        if (wound > 1 && !['W2', 'W4'].includes(item.slot)) return fail(400, { wounded: true });
        let ammo = false;
        let broken = false;
        let woundedW0 = false;
        let woundedW1 = false;
        let force = false;
        if (item.slot === 'W0' && Math.random() > 0.75) {
            wound += 1;
            woundedW0 = wound;
        }
        // Gestion de la casse de l'objet si non arme à feu
        else if (item.slot === 'W1') {
            item.durability -= 1;
            if (item.durability === 0) {
                slots['W1'] = '';
                broken = true;
            }
            if (Math.random() > 0.99) {
                wound += 1;
                woundedW1 = wound;
            }
        }
        // Gestion des munitions si arme à feu
        else if (item.slot === 'W2') {
            slots['W3'].quantity -= 1;
            if (slots['W3'].quantity === 0) {
                slots['W3'] = '';
                ammo = true;
            }
        }
        // Gestion des explosifs
        else if (item.slot === 'W4') {
            slots['W4'].quantity -= 1;
            if (slots['W4'].quantity === 0) {
                slots['W4'] = '';
            }
            if (item.description === 'Une grenade fumigène') force = true;
        }
        // Possibilité de coup critique?? Affiché dans les logs
        // Gestion de la qualité de l'arme??
        const zombies = map.rows[li][lj].zombies;
        map.rows[li][lj].zombies -= item.attack;
        if (map.rows[li][lj].zombies < 0) map.rows[li][lj].zombies = 0;
        const killed = zombies - map.rows[li][lj].zombies;
        // Coup critique :
        let critical = 0;
        if (map.rows[li][lj].zombies > 0 && Math.random() > 0.9) {
            map.rows[li][lj].zombies -= (Math.ceil(item.attack * Math.random()));
            if (map.rows[li][lj].zombies < 0) map.rows[li][lj].zombies = 0;
            critical = zombies - killed - map.rows[li][lj].zombies;
        } 
        await getAttack(locals.user.id, map, slots, locals.user.ap, locals.user.hunger, locals.user.thirst, wound, force, locals.rethinkdb)
        await addLog(locals.user.id, locals.user.location, locals.user.username, 'kill', { 'zombies': killed, 'weapon': item.slot !== 'W0' ? item.description : 'Ses poings', ammo, broken, woundedW0, woundedW1, critical }, locals.rethinkdb);
        throw redirect(303, '/map');
    } else return fail(400, { item: true });
}

const building = async ({ locals, request }) => {
    const ap = locals.user.ap;
    if (ap === 0) return fail(400, { exhausted: true });
    const li = locals.user.i;
    const lj = locals.user.j;
    const map = await getMap(locals.user.id, locals.rethinkdb);
    if (!map.rows[li][lj].building) return fail(400, { building: true });
    // Si le bâtiment est vide, on renvoie une erreur
    if (map.rows[li][lj].building.empty) return fail(400, { emptyBuilding: true });
    // Si le bâtiment a déjà été fouillé ce jour, on renvoie une erreur
    if (map.rows[li][lj].building.searchedBy.includes(locals.user.id)) return fail(400, { searchedBuilding: true });

    const code = map.rows[li][lj].building.code;
    const items = await getItemsByCode(code, locals.rethinkdb);

    // REFACTO avec des options pour les valeurs
    let pool = [];
    for (let item of items) {
        if (!item.unique || !map.uniques.includes(item.id)) {
            // Probabilité en fonction du type
            const type = item.type === 'resource' ? 10 :
                item.type === 'ammunition' ? 15 :
                item.type === 'explosive' ? 5 :
                ['food', 'drink'].includes(item.type) ? 3 :
                ['drug', 'weapon', 'armour'].includes(item.type) ? 2 : 1;
            // Probabilité en fonction de la rareté
            const rarity = item.rarity === 'commun' ? 5 :
                item.rarity === 'inhabituel' ? 3 :
                item.rarity === 'rare' ? 2 : 1;
            for (let i = 0; i < (type * rarity); i++) {
                pool.push(item);
            }
        }
    }

    // REFACTO AUSSI ??
    // Possibilité de trouver entre 2 et 5 objets à la fois
    let loots = [];
    for (let i = 0; i < (Math.ceil(Math.random() * 4) + 1); i++) {
        const foundItem = pool[Math.floor(Math.random() * pool.length)];
        pool = pool.filter(i => i.id !== foundItem.id);
        if (foundItem.slot === "W1") foundItem.durability = Math.ceil(foundItem.durabilityMax * (50 + Math.round(Math.random() * 50)) / 100);
        foundItem.quality = 50 + Math.round(Math.random() * 50);
        foundItem.uuid = crypto.randomUUID();
        // Si l'item est une munition, on ajoute une quantité aléatoire
        if (foundItem.type === 'ammunition') foundItem.quantity = Math.ceil(Math.random() * 10);
        if (foundItem.type === 'explosive') foundItem.quantity = 1;
        // Si la munition est déjà présente sur la case, on stack la munition
        if (['ammunition', 'explosive'].includes(foundItem.type) && map.rows[li][lj].items.find(i => i.id === foundItem.id)) map.rows[li][lj].items.find(i => i.id === foundItem.id).quantity += foundItem.quantity;
        else {
            // On met l'item entier dans la case de la map
            map.rows[li][lj].items.push(foundItem);
            // Gestion des objets uniques
            if (foundItem.unique) map.uniques.push(foundItem.id);
        }
        loots.push(foundItem);
    }

    map.rows[li][lj].building.searchedBy.push(locals.user.id);

    // Bâtiments non épuisables??
    // Ne se régénère pas...
    map.rows[li][lj].building.empty = Math.random() > 0.9;
    
    // Même fonction que pour la fouille de la zone
    await getSearch(locals.user.id, map, ap, locals.user.hunger, locals.user.thirst, locals.rethinkdb);
    await addLog(locals.user.id, locals.user.location, locals.user.username, 'building', { loots, 'empty': map.rows[li][lj].building.empty }, locals.rethinkdb);
}

const drop = async ({ locals, request }) => {
    const data = await request.formData();
    const id = data.get('id');
    const inventory = locals.user.inventory;
    // On vérifie que l'item est bien présent à son point d'origine
    if (!inventory.some(i => i.id === id)) return fail(400, { origin: true });
    // Possibilité de simplifier...?
    const getItem = () => {
        for (let item of inventory) {
            if (item.id === id) {
                inventory.splice(inventory.indexOf(item), 1);
                return item;
            }
        }
    }
    const item = getItem();
    const map = await getMap(locals.user.id, locals.rethinkdb);
    const li = locals.user.i;
    const lj = locals.user.j;
    const slots = locals.user.slots;
    if (['ammunition', 'explosive'].includes(item.type) && map.rows[li][lj].items.find(i => i.id === item.id)) map.rows[li][lj].items.find(i => i.id === item.id).quantity += item.quantity;
    else map.rows[li][lj].items.push(item);
    await moveItem(locals.user.id, map, inventory, slots, locals.rethinkdb);
    await addLog(locals.user.id, locals.user.location, locals.user.username, 'drop', { item }, locals.rethinkdb);
    throw redirect(303, '/map');
}

const force = async ({ locals }) => {
    const map = await getMap(locals.user.id, locals.rethinkdb);
    if (map.rows[locals.user.i][locals.user.j].zombies <= ((locals.user.slots.A1.defense ?? 0) + (locals.user.slots.A2.defense ?? 0) + (locals.user.slots.A3.defense ?? 0))) return fail(400, { clear: true });
    if (locals.user.wound > 1) return fail(400, { force: true });
    await pushThrough(locals.user.id, locals.rethinkdb);
    await addLog(locals.user.id, locals.user.location, locals.user.username, 'force', { wound: true }, locals.rethinkdb);
}

const nextday = async ({ locals }) => {
    await getNextDay(locals.user.id, locals.user.days, locals.user.location, locals.user.hunger, locals.user.thirst, locals.user.wound, locals.rethinkdb);
    if (locals.user.wound > 0) await addLog(locals.user.id, locals.user.location, locals.user.username, 'wound', { 'wound': locals.user.wound }, locals.rethinkdb);
}

const pickUp = async ({ locals, request }) => {
    const data = await request.formData();
    const id = data.get('id');
    const li = locals.user.i;
    const lj = locals.user.j;
    const map = await getMap(locals.user.id, locals.rethinkdb);
    // On vérifie que l'item est bien présent à son point d'origine
    if (!map.rows[li][lj].items.some(i => i.id === id)) return fail(400, { origin: true });
    // Possibilité de simplifier...?
    const getItem = () => {
        for (let item of map.rows[li][lj].items) {
            if (item.id === id) {
                map.rows[li][lj].items.splice(map.rows[li][lj].items.indexOf(item), 1);
                return item;
            }
        }
    }
    const item = getItem();
    const slots = locals.user.slots;
    const inventory = locals.user.inventory;
    if (['ammunition', 'explosive'].includes(item.type) && slots[item.slot].id === item.id) slots[item.slot].quantity += item.quantity;
    else if (['ammunition', 'explosive'].includes(item.type) && inventory.find(i => i.id === item.id)) inventory.find(i => i.id === item.id).quantity += item.quantity;
    else {
        // On vérifie que l'inventaire n'est pas plein
        if (inventory.length === 10) return fail(400, { full: true });
        inventory.push(item);
    }
    await moveItem(locals.user.id, map, inventory, slots, locals.rethinkdb);
    await addLog(locals.user.id, locals.user.location, locals.user.username, 'pickup', { item }, locals.rethinkdb);
    throw redirect(303, '/map');
}

const reset = async ({ locals }) => {
    await generateMap(locals.user.id, locals.rethinkdb);
    await deleteLogs(locals.user.id, locals.rethinkdb);
}

const search = async ({ locals }) => {
    const ap = locals.user.ap;
    const li = locals.user.i;
    const lj = locals.user.j;
    const map = await getMap(locals.user.id, locals.rethinkdb);
    const itemList = await getItems(locals.rethinkdb);
    if (ap > 0) {
        // Si la zone est vide, on renvoie une erreur
        if (map.rows[li][lj].empty) return fail(400, { empty: true });
        // Si la case a déjà été fouillée ce jour, on renvoie une erreur
        if (map.rows[li][lj].searchedBy.includes(locals.user.id)) return fail(400, { searched: true });
        const danger = map.rows[li][lj].layout.danger;
        // Gestion de la rareté de la case
        // Faire 3 requêtes séparées??
        const getItems = (danger) => {
            if (danger === 1) {
                return itemList.filter(i => i.type !== 'misc' && ['commun', 'inhabituel'].includes(i.rarity));
            } else if (danger === 2) {
                return itemList.filter(i => i.type !== 'misc' && ['commun', 'inhabituel', 'rare'].includes(i.rarity));
            } else if (danger === 3) {
                return itemList.filter(i => i.type !== 'misc' && ['commun', 'inhabituel', 'rare', 'épique'].includes(i.rarity));
            }
        }
        const items = getItems(danger);
        let pool = [];
        for (let item of items) {
            if (!item.unique || !map.uniques.includes(item.id)) {
                // Probabilité en fonction du type
                const type = item.type === 'resource' ? 10 :
                    item.type === 'ammunition' ? 15 :
                    item.type === 'explosive' ? 5 :
                    ['food', 'drink'].includes(item.type) ? 3 :
                    ['drug', 'weapon', 'armour'].includes(item.type) ? 2 : 1;
                // Probabilité en fonction de la rareté
                const rarity = item.rarity === 'commun' ? 5 :
                    item.rarity === 'inhabituel' ? 3 :
                    item.rarity === 'rare' ? 2 : 1;
                for (let i = 0; i < (type * rarity); i++) {
                    pool.push(item);
                }
            }
        }
        // Possibilité de trouver jusqu'à 3 objets à la fois
        let loots = [];
        for (let i = 0; i < Math.ceil(Math.random() * 3); i++) {
            const foundItem = pool[Math.floor(Math.random() * pool.length)];
            pool = pool.filter(i => i.id !== foundItem.id);
            if (foundItem.slot === "W1") foundItem.durability = Math.ceil(foundItem.durabilityMax * (50 + Math.round(Math.random() * 50)) / 100);
            foundItem.quality = 50 + Math.round(Math.random() * 50);
            foundItem.uuid = crypto.randomUUID();
            // Si l'item est une munition, on ajoute une quantité aléatoire
            if (foundItem.type === 'ammunition') foundItem.quantity = Math.ceil(Math.random() * 10);
            if (foundItem.type === 'explosive') foundItem.quantity = 1;
            // Si la munition est déjà présente sur la case, on stack la munition
            if (['ammunition', 'explosive'].includes(foundItem.type) && map.rows[li][lj].items.find(i => i.id === foundItem.id)) map.rows[li][lj].items.find(i => i.id === foundItem.id).quantity += foundItem.quantity;
            else {
                // On met l'item entier dans la case de la map
                map.rows[li][lj].items.push(foundItem);
                // Gestion des objets uniques
                if (foundItem.unique) map.uniques.push(foundItem.id);
            }
            loots.push(foundItem);
        }
        map.rows[li][lj].searchedBy.push(locals.user.id);
        map.rows[li][lj].empty = Math.random() > (danger === 1 ?
            0.5 : danger === 2 ?
            0.75 : 0.9);
        await getSearch(locals.user.id, map, ap, locals.user.hunger, locals.user.thirst, locals.rethinkdb)
        await addLog(locals.user.id, locals.user.location, locals.user.username, 'loot', { loots, 'empty': map.rows[li][lj].empty }, locals.rethinkdb);
    } else return fail(400, { exhausted: true })
}

const travel = async ({ locals, request }) => {
    const ap = locals.user.ap;
    if (ap > 0) {
        const location = locals.user.location;
        const li = locals.user.i;
        const lj = locals.user.j;
        const data = await request.formData();
        const target = data.get('target');
        const ti = data.get('ti');
        const tj = data.get('tj');
        const map = await getMap(locals.user.id, locals.rethinkdb);
        if (map.rows[ti][tj].coordinate !== target) return fail(400, { location: true });
        if ((map.rows[li][lj].zombies > ((locals.user.slots.A1.defense ?? 0) + (locals.user.slots.A2.defense ?? 0) + (locals.user.slots.A3.defense ?? 0))) && !locals.user.force) return fail(400, { blocked: true });
        // Refactoriser?? utilisé sur +page.svelte aussi
        const border = map.rows[ti][tj].layout.border;
        // Vérification de la possibilité de voyager (anti-triche)
        if (canTravel(location, target, border)) {
            map.rows[li][lj].estimated.zombies = map.rows[li][lj].zombies;
            map.rows[li][lj].estimated.empty = map.rows[li][lj].empty;
            if (map.rows[ti][tj].visible !== true) map.rows[ti][tj].visible = true;
            if (map.rows[ti][tj].visited !== true) map.rows[ti][tj].visited = true;
            await getTravel(locals.user.id, target, ti, tj, ap, locals.user.hunger, locals.user.thirst, map, locals.rethinkdb);
            await addLog(locals.user.id, location, locals.user.username, 'out', {}, locals.rethinkdb);
            await addLog(locals.user.id, target, locals.user.username, 'in', {}, locals.rethinkdb);
        }
    } else return fail(400, { exhausted: true })
    throw redirect(303, '/map');
}

const tunnel = async ({ locals }) => {
    const ap = locals.user.ap;
    if (ap === 0) return fail(400, { exhausted: true });
    const location = locals.user.location;
    const tunnel = await getMapTunnel(locals.user.id, locals.rethinkdb);
    if (!tunnel.includes(location)) return fail(400, { tunnel: true });
    // Actualisation des zones sortante et entrante
    const li = locals.user.i;
    const lj = locals.user.j;
    const exit = tunnel.filter(c => c !== location)[0];
    const { i: ti, j: tj } = getIJ(exit);
    const map = await getMap(locals.user.id, locals.rethinkdb);
    map.rows[li][lj].estimated.zombies = map.rows[li][lj].zombies;
    map.rows[li][lj].estimated.empty = map.rows[li][lj].empty;
    if (map.rows[ti][tj].visible !== true) map.rows[ti][tj].visible = true;
    if (map.rows[ti][tj].visited !== true) map.rows[ti][tj].visited = true;
    await getTravel(locals.user.id, exit, ti, tj, ap, locals.user.hunger, locals.user.thirst, map, locals.rethinkdb);
    await addLog(locals.user.id, location, locals.user.username, 'outTunnel', {}, locals.rethinkdb);
    await addLog(locals.user.id, exit, locals.user.username, 'inTunnel', {}, locals.rethinkdb);
}

export const actions = { attack, building, drop, force, nextday, pickUp, reset, search, travel, tunnel };
