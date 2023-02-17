import { fail, redirect } from "@sveltejs/kit";
import { findOrigin, getItem, handleBag } from "$lib/loots";
import { _equip } from "$lib/server/users";

export async function load() {
    throw redirect(303, '/');
}

const equip = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const { origin, target } = findOrigin(locals.user.bag1, locals.user.bag2, locals.user.inventory, uuid);
    if (!origin) return fail(400, { item: true });
    const { item } = getItem(target, uuid, false);
    const slots = locals.user.slots;
    if (slots[item.slot]) {
        if (item.capacity < (item.slot === 'B1' ? locals.user.bag1.length : locals.user.bag2.length)) return fail(400, { bag: true });
        target.push(slots[item.slot]);
    }
    slots[item.slot] = item;
    await _equip(locals.user.id, origin, slots, target, locals.rethinkdb);
}

const unequip = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const slots = locals.user.slots;
    const item = Object.entries(slots).find(slot => slot.find(i => i.uuid === uuid))?.find(i => i.uuid === uuid);
    if (!item) return fail(400, { item: true });
    else if (item.slot === 'B1' && locals.user.bag1.length || item.slot === 'B2' && locals.user.bag2.length) return fail(400, { bag: true });
    const { destination, target } = handleBag(item, locals.user);
    if (destination === 'full') return fail(400, { full: true })
    slots[item.slot] = '';
    await _equip(locals.user.id, destination, slots, target, locals.rethinkdb);
}

export const actions = { equip, unequip };
