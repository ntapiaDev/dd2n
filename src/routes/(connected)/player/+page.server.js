import { fail, redirect } from "@sveltejs/kit";
import { findOrigin, getItem } from "$lib/loots";
import { add_log } from "$lib/server/logs";
import { _boost, _feed, _heal } from "$lib/server/users";

export async function load() {
    throw redirect(303, '/');
}

const boost = async ({ locals, request }) => {
    let ap = locals.user.ap;
    if (ap === 100) return fail(400, { full: true });
    const data = await request.formData();
    const uuid = data.get('uuid');
    const { origin, target } = findOrigin(locals.user.bag1, locals.user.bag2, locals.user.inventory, uuid);
    if (!origin) return fail(400, { item: true });
    const { item } = getItem(target, uuid, false);
    if (!item.ap) return fail(400, { type: true });
    ap += item.ap;
    if (ap > 100) ap = 100;
    const value = ap - locals.user.ap;
    await _boost(locals.user.id, origin, item, ap, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'boost', { boost: item.description, value }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

const feed = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const { origin, target } = findOrigin(locals.user.bag1, locals.user.bag2, locals.user.inventory, uuid);
    if (!origin) return fail(400, { item: true });
    const { item } = getItem(target, uuid, false);
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
    await _feed(locals.user.id, origin, item, ap, hunger, thirst, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'feed', { feed: item.description, type: item.type, value: ap - locals.user.ap }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

const heal = async ({ locals, request }) => {
    let wound = locals.user.wound;
    if (!wound) return fail(400, { healthy: true });
    const data = await request.formData();
    const uuid = data.get('uuid');
    const { origin, target } = findOrigin(locals.user.bag1, locals.user.bag2, locals.user.inventory, uuid);
    if (!origin) return fail(400, { item: true });
    const { item } = getItem(target, uuid, false);
    if (item.type !== 'drug') return fail(400, { drug: true });    
    if (!(wound === 1 || wound === 2 && item.rarity ==='rare' || item.rarity === 'épique')) return fail(400, { weak: true });
    await _heal(locals.user.id, origin, item, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'heal', { 'drug': item.description }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

export const actions = { boost, feed, heal };
