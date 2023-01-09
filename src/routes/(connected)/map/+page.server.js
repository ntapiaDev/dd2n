import { fail, redirect } from "@sveltejs/kit";
import { canTravel } from '../../../utils/tools';
import { generateMap, getAttack, getMap, getNextDay, getSearch, getTravel } from "../../../utils/maps";
import { getItems, moveItem } from '../../../utils/items';

export async function load({ locals }) {
    const map = await getMap(locals.user.id, locals.rethinkdb);
    return { map };
}

const attack = async ({ locals, request }) => {
    const data = await request.formData();
    const id = data.get('id');
    const slots = locals.user.slots;
    const item = Object.entries(slots).find(slot => slot.find(i => i.id === id))?.find(i => i.id === id);
    // Vérification que l'objet existe (prévoir un cas d'erreur? message flash??)
    if (item) {
        const map = await getMap(locals.user.id, locals.rethinkdb);
        if (map.rows[locals.user.i][locals.user.j].zombies === 0) return fail(400, { zombies: true });
        if (item.weapon && item.weapon !== slots.W3.weapon) return fail(400, { ammo: true });
        // Gestion de la casse de l'objet si non arme à feu
        if (item.slot === 'W1') {
            item.durability -= 1;
            if (item.durability === 0) slots['W1'] = ''; // Casse à afficher dans les logs
        }
        // Gestion des munitions si arme à feu
        else if (item.slot === 'W2') {
            slots['W3'].quantity -= 1;
            if (slots['W3'].quantity === 0) slots['W3'] = '';
        }
        // Possibilité de coup critique?? Affiché dans les logs
        // Gestion de la qualité de l'arme??
        map.rows[locals.user.i][locals.user.j].zombies -= item.attack;
        if (map.rows[locals.user.i][locals.user.j].zombies < 0) map.rows[locals.user.i][locals.user.j].zombies = 0;
        await getAttack(locals.user.id, map, slots, locals.user.ap, locals.rethinkdb)
        throw redirect(303, '/map');
    } else return fail(400, { item: true });
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
    if (item.type === 'ammunition' && map.rows[li][lj].items.find(i => i.id === item.id)) map.rows[li][lj].items.find(i => i.id === item.id).quantity += item.quantity;
    else map.rows[li][lj].items.push(item);
    await moveItem(locals.user.id, map, inventory, slots, locals.rethinkdb);
    throw redirect(303, '/map');
}

const nextday = async ({ locals }) => {
    await getNextDay(locals.user.days, locals.user.location, locals.user.id, locals.rethinkdb);
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
    if (item.type === 'ammunition' && slots[item.slot].id === item.id) slots[item.slot].quantity += item.quantity;
    else if (item.type === 'ammunition' && inventory.find(i => i.id === item.id)) inventory.find(i => i.id === item.id).quantity += item.quantity;
    else {
        // On vérifie que l'inventaire n'est pas plein
        if (inventory.length === 10) return fail(400, { full: true });
        inventory.push(item);
    }
    await moveItem(locals.user.id, map, inventory, slots, locals.rethinkdb);
    throw redirect(303, '/map');
}

const reset = async ({ locals }) => {
    await generateMap(locals.user.id, locals.rethinkdb);
}

const search = async ({ locals }) => {
    const ap = locals.user.ap;
    const li = locals.user.i;
    const lj = locals.user.j;
    const map = await getMap(locals.user.id, locals.rethinkdb);
    const itemList = await getItems(locals.rethinkdb);
    if (ap > 0) {
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
        for (let i = 0; i < Math.ceil(Math.random() * 3); i++) {
            const foundItem = pool[Math.floor(Math.random() * pool.length)];
            pool = pool.filter(i => i.id !== foundItem.id);
            if (foundItem.slot === "W1") foundItem.durability = Math.ceil(foundItem.durabilityMax * (50 + Math.round(Math.random() * 50)) / 100);
            foundItem.quality = 50 + Math.round(Math.random() * 50);
            foundItem.uuid = crypto.randomUUID();
            // Si l'item est une munition, on ajoute une quantité aléatoire
            if (foundItem.type === 'ammunition') foundItem.quantity = Math.ceil(Math.random() * 10);
            // Si la munition est déjà présente sur la case, on stack la munition
            if (foundItem.type === 'ammunition' && map.rows[li][lj].items.find(i => i.id === foundItem.id)) map.rows[li][lj].items.find(i => i.id === foundItem.id).quantity += foundItem.quantity;
            else {
                // On met l'item entier dans la case de la map
                map.rows[li][lj].items.push(foundItem);
                // Gestion des objets uniques
                if (foundItem.unique) map.uniques.push(foundItem.id);
            }
        }
        map.rows[li][lj].searchedBy.push(locals.user.id);
        await getSearch(locals.user.id, map, ap, locals.rethinkdb)
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
        // Refactoriser?? utilisé sur +page.svelte aussi
        const border = map.rows[ti][tj].layout.border;
        // Vérification de la possibilité de voyager (anti-triche)
        if (canTravel(location, target, border)) {
            // Trop lourd???
            // (map.rows.find(row => row.find(c => c.coordinate === location)).find(c => c.coordinate === location)).estimated = (map.rows.find(row => row.find(c => c.coordinate === location)).find(c => c.coordinate === location)).zombies;
            // (map.rows.find(row => row.find(c => c.coordinate === target)).find(c => c.coordinate === target)).visible = true;
            // (map.rows.find(row => row.find(c => c.coordinate === target)).find(c => c.coordinate === target)).visited = true;
            map.rows[li][lj].estimated = map.rows[li][lj].zombies;
            if (map.rows[ti][tj].visible !== true) map.rows[ti][tj].visible = true;
            if (map.rows[ti][tj].visited !== true) map.rows[ti][tj].visited = true;
            await getTravel(locals.user.id, target, ti, tj, ap, map, locals.rethinkdb);
        }
    } else return fail(400, { exhausted: true })
    throw redirect(303, '/map');
}

export const actions = { attack, drop, nextday, pickUp, reset, search, travel };
