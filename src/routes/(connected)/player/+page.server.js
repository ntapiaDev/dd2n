import { fail, redirect } from "@sveltejs/kit";
import { add_log } from "$lib/server/logs";
import { _feed, _heal } from "$lib/server/users";
import { getItem } from "$lib/loots";

export async function load() {
    throw redirect(303, '/');
}

const feed = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const inventory = locals.user.inventory;
    if (!inventory.some(i => i.uuid === uuid)) return fail(400, { origin: true });
    const { item } = getItem(inventory, uuid, false);
    if (!['drink', 'food'].includes(item.type)) return fail(400, { type: true });
    let hunger = locals.user.hunger;
    let thirst = locals.user.thirst;
    let fed;
    if (item.type === 'food') {
        if (hunger > 75) return fail(400, { satiated: true });
        hunger += item.value;
        if (hunger > 100) hunger = 100;
        fed = hunger - locals.user.hunger;
    } else if (item.type === 'drink') {
        if (thirst > 75) return fail(400, { hydrated: true });
        thirst += item.value;
        if (thirst > 100) thirst = 100;
        fed = thirst - locals.user.thirst;
    }
    let ap = locals.user.ap + Math.floor(fed/10);
    if (ap > 100) ap = 100;
    await _feed(locals.user.id, item, ap, hunger, thirst, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'feed', { feed: item.description, type: item.type, value: ap - locals.user.ap }, locals.rethinkdb);
}

const heal = async ({ locals, request }) => {
    let wound = locals.user.wound;
    if (!wound) return fail(400, { healthy: true });
    const data = await request.formData();
    const uuid = data.get('uuid');
    const inventory = locals.user.inventory;
    if (!inventory.some(i => i.uuid === uuid)) return fail(400, { origin: true });
    const { item } = getItem(inventory, uuid, false);
    if (item.type !== 'drug') return fail(400, { drug: true });    
    if (!(wound === 1 || wound === 2 && item.rarity ==='rare' || item.rarity === 'épique')) return fail(400, { weak: true });
    await _heal(locals.user.id, item, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'heal', { 'drug': item.description }, locals.rethinkdb);
}

export const actions = { feed, heal };
