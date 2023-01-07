import { fail, redirect } from "@sveltejs/kit";
import { canTravel } from '../../../utils/tools';
import { generateMap, getMap, getNextDay, getSearch, getTravel } from "../../../utils/maps";
import { getItems, moveItem } from '../../../utils/items';

export async function load({ locals }) {
    const map = await getMap(locals.user.id, locals.rethinkdb);
    return { map };
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
    const map = await getMap(locals.user.id, locals.rethinkdb);
    map.rows[locals.user.i][locals.user.j].items.push(getItem())
    await moveItem(locals.user.id, map, inventory, locals.rethinkdb);
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
    // On vérifie que l'inventaire n'est pas plein
    const inventory = locals.user.inventory;
    if (inventory.length === 10) return fail(400, { full: true });
    // Possibilité de simplifier...?
    const getItem = () => {
        for (let item of map.rows[li][lj].items) {
            if (item.id === id) {
                map.rows[li][lj].items.splice(map.rows[li][lj].items.indexOf(item), 1);
                return item;
            }
        }
    }
    inventory.push(getItem())
    await moveItem(locals.user.id, map, inventory, locals.rethinkdb);
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
                    ['food', 'drink', 'ammunition'].includes(item.type) ? 3 :
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
            foundItem.quality = 50 + Math.round(Math.random() * 50);
            foundItem.uuid = crypto.randomUUID();
            // On met l'item entier dans la case de la map
            map.rows[li][lj].items.push(foundItem);
            // Gestion des objets uniques
            if (foundItem.unique) map.uniques.push(foundItem.id);
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

export const actions = { drop, nextday, pickUp, reset, search, travel };
