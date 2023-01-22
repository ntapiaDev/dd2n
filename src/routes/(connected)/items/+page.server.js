import { fail, redirect } from "@sveltejs/kit";
import { getItem } from "$lib/loots";
import { _equip } from "$lib/server/users";

export async function load() {
    throw redirect(303, '/');
}

const equip = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const inventory = locals.user.inventory;
    if (!inventory.find(i => i.uuid === uuid)) return fail(400, { item: true });
    const { item, items } = getItem(inventory, uuid, false);
    const slots = locals.user.slots;
    if (slots[item.slot]) items.push(slots[item.slot]);
    slots[item.slot] = item;
    await _equip(locals.user.id, items, slots, locals.rethinkdb);
}

const unequip = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const slots = locals.user.slots;
    const item = Object.entries(slots).find(slot => slot.find(i => i.uuid === uuid))?.find(i => i.uuid === uuid);
    if (!item) return fail(400, { item: true });
    const inventory = locals.user.inventory;
    if (inventory.length === 10) return fail(400, { full: true });
    inventory.push(item);
    slots[item.slot] = '';
    await _equip(locals.user.id, inventory, slots, locals.rethinkdb);
}

export const actions = { equip, unequip };
