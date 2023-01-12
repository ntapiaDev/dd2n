import { fail, redirect } from "@sveltejs/kit";
import { addLog } from "../../../utils/logs";
import { getFeed, getHeal } from "../../../utils/player";

export async function load() {
    throw redirect(303, '/');
}

const feed = async ({ locals, request }) => {
    // FACTORISER !!
    const data = await request.formData();
    const uuid = data.get('uuid');
    const inventory = locals.user.inventory;
    // On vérifie que l'item est bien présent dans l'inventaire
    if (!inventory.some(i => i.uuid === uuid)) return fail(400, { origin: true });
    // On récupère l'item
    const getItem = () => {
        for (let item of inventory) {
            if (item.uuid === uuid) {
                inventory.splice(inventory.indexOf(item), 1);
                return item;
            }
        }
    }
    const item = getItem();
    // On vérifie que l'item est bien de la nourriture
    if (!['drink', 'food'].includes(item.type)) return fail(400, { type: true });
    let hunger = locals.user.hunger;
    let thirst = locals.user.thirst;
    let type;
    let fed;
    if (item.type === 'food') {
        if (hunger > 75) return fail(400, { satiated: true });
        hunger += item.value;
        if (hunger > 100) hunger = 100;
        type = 'food';
        fed = hunger - locals.user.hunger;
    } else if (item.type === 'drink') {
        if (thirst > 75) return fail(400, { hydrated: true });
        thirst += item.value;
        if (thirst > 100) thirst = 100;
        type = 'drink';
        fed = thirst - locals.user.thirst;
    }
    let ap = locals.user.ap + Math.floor(fed/10);
    if (ap > 100) ap = 100;
    const value = ap - locals.user.ap;
    await getFeed(locals.user.id, inventory, hunger, thirst, ap, locals.rethinkdb);
    await addLog(locals.user.id, locals.user.location, locals.user.username, 'feed', { 'feed': item.description, type, value }, locals.rethinkdb);
}

const heal = async ({ locals, request }) => {
    // On vérifie que le joueur est blessé
    let wound = locals.user.wound;
    if (!wound) return fail(400, { healthy: true });
    const data = await request.formData();
    const uuid = data.get('uuid');
    const inventory = locals.user.inventory;
    // On vérifie que l'item est bien présent dans l'inventaire
    if (!inventory.some(i => i.uuid === uuid)) return fail(400, { origin: true });
    // On récupère l'item
    const getItem = () => {
        for (let item of inventory) {
            if (item.uuid === uuid) {
                inventory.splice(inventory.indexOf(item), 1);
                return item;
            }
        }
    }
    const item = getItem();
    // On vérifie que l'item est bien un médicament
    if (item.type !== 'drug') return fail(400, { drug: true });    
    if (wound === 1 || wound === 2 && item.rarity ==='rare' || item.rarity === 'épique') wound = 0;
    else return fail(400, { weak: true });
    await getHeal(locals.user.id, inventory, wound, locals.rethinkdb);
    await addLog(locals.user.id, locals.user.location, locals.user.username, 'heal', { 'drug': item.description }, locals.rethinkdb);
}

export const actions = { feed, heal };
