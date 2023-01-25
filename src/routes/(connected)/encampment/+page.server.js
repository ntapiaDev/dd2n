import { fail, redirect } from "@sveltejs/kit";
import { getItem, handleStack } from "$lib/loots";
import { add_user_to_location } from "$lib/server/cells";
import { get_encampment, get_bank, remove_user_from_encampment, update_bank } from "$lib/server/encampments";
import { add_log, add_logs, get_last_date, get_logs_by_coordinate } from "$lib/server/logs";
import { _equip, leave_encampment } from "$lib/server/users";

export const load = async ({ locals }) => {
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    const lastDate = await get_last_date(locals.user.game_id, locals.game.players.map(p => p.username), locals.rethinkdb);
    const logs = await get_logs_by_coordinate(locals.user.game_id, locals.user.location, locals.rethinkdb);
    return { encampment, lastDate, logs };
}

const deposit = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const inventory = locals.user.inventory;
    if (!inventory.some(i => i.uuid === uuid)) return fail(400, { origin: true });    
    const { item } = getItem(inventory, uuid, false);
    const bank = await get_bank(locals.user.game_id, locals.rethinkdb);
    const items = handleStack(bank, item);
    const slots = locals.user.slots;
    await update_bank(locals.user.game_id, items, locals.rethinkdb);
    await _equip(locals.user.id, inventory, slots, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'deposit', { item }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

const map = async ({ locals }) => {
    await remove_user_from_encampment(locals.user.game_id, locals.user.username, locals.rethinkdb);
    await add_user_to_location(locals.user.game_id, locals.user.username, locals.game.encampment, locals.rethinkdb);
    await leave_encampment(locals.user.id, locals.rethinkdb);
    await add_logs(locals.user.game_id, [
        { coordinate: 'Encampment', player: locals.user.username, action: 'outEncampment', log: '', gender: locals.user.gender, color: locals.user.color },
        { coordinate: locals.game.encampment, player: locals.user.username, action: 'inEncampment', log: '', gender: locals.user.gender, color: locals.user.color }
    ], locals.rethinkdb);
    throw redirect(303, '/map');
}

const withdraw = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const bank = await get_bank(locals.user.game_id, locals.rethinkdb);
    if (!bank.some(i => i.uuid === uuid)) return fail(400, { origin: true });
    const { item } = getItem(bank, uuid, true);
    const slots = locals.user.slots;
    const inventory = locals.user.inventory;
    if (['ammunition', 'explosive'].includes(item.type) && slots[item.slot].id === item.id) slots[item.slot].quantity += item.quantity;
    else if (['ammunition', 'explosive'].includes(item.type) && inventory.find(i => i.id === item.id)) inventory.find(i => i.id === item.id).quantity += item.quantity;
    else {
        if (inventory.length === 10) return fail(400, { full: true });
        if (!['ammunition', 'explosive'].includes(item.type)) item.quantity = 1;
        item.uuid = crypto.randomUUID();
        inventory.push(item);
    }
    await update_bank(locals.user.game_id, bank, locals.rethinkdb);
    await _equip(locals.user.id, inventory, slots, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'withdraw', { item }, locals.user.gender, locals.user.color, locals.rethinkdb);
    throw redirect(303, '/encampment');
}

export const actions = { deposit, map, withdraw };
