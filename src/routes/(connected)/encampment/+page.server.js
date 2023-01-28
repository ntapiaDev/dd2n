import { fail, redirect } from "@sveltejs/kit";
import { getItem, handleStack, sortItems } from "$lib/loots";
import { checkHT } from "$lib/player";
import { checkResources, isBlocked } from "$lib/worksites";
import { add_user_to_location } from "$lib/server/cells";
import { add_worksite, build, built, get_encampment, get_bank, remove_user_from_encampment, update_bank } from "$lib/server/encampments";
import { add_log, add_logs, get_last_date, get_logs_by_coordinate } from "$lib/server/logs";
import { _equip, get_slots_by_game, leave_encampment, update_stats, use_item } from "$lib/server/users";
import { get_worksite, get_worksites_by_group } from "$lib/server/worksites";

export const load = async ({ locals }) => {
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    const lastDate = await get_last_date(locals.user.game_id, locals.game.players.map(p => p.username), locals.rethinkdb);
    const logs = await get_logs_by_coordinate(locals.user.game_id, locals.user.location, locals.rethinkdb);
    const slots = await get_slots_by_game(locals.user.game_id, locals.rethinkdb);
    const worksites = await get_worksites_by_group(locals.rethinkdb);
    return { encampment, lastDate, logs, slots, worksites };
}

const blueprint = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const inventory = locals.user.inventory;
    if (!inventory.some(i => i.uuid === uuid)) return fail(400, { origin: true });    
    const { item } = getItem(inventory, uuid, false);
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    const id = item.worksite_id;
    if (encampment.worksites.completed.includes(id)) return fail(400, { completed: true });
    else if (encampment.worksites.unlocked.some(w => w.id === id)) return fail(400, { already: true });
    const worksite = await get_worksite(id, locals.rethinkdb);
    await add_worksite(locals.user.game_id, worksite.ap, id, locals.rethinkdb);
    await use_item(locals.user.id, item, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'blueprint', { name: worksite.name }, locals.user.gender, locals.user.color, locals.rethinkdb);
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

const worksite = async ({ locals, request }) => {
    const data = await request.formData();
    const ap = parseInt(data.get('ap'));
    if (!ap) return fail(400, { nothing: true });
    else if (ap > locals.user.ap) return fail(400, { ap: true });
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    const id = data.get('id');
    const unlocked = encampment.worksites.unlocked;
    if (encampment.worksites.completed.includes(id)) return fail(400, { completed: true });
    else if (!unlocked.some(w => w.id === id)) return fail(400, { unlocked: true });
    else if (unlocked.find(w => w.id === id).ap < ap) return fail(400, { toMuch: true });
    const bank = encampment.items;
    const worksites = await get_worksites_by_group(locals.rethinkdb);
    const worksite = worksites.find(g => g.reduction.find(w => w.id === id)).reduction.find(w => w.id === id);
    if (isBlocked(worksite, encampment.worksites.completed, worksites)) return fail(400, { unlocked: true });
    if (!checkResources(bank, worksite.resources)) return fail(400, { resources: true });
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst, ap);
    await update_stats(locals.user.id, ap, hunger, thirst, locals.rethinkdb);
    let completed = false;
    let items = [];
    if (unlocked.find(w => w.id === id).ap === ap) {
        for (let resource of worksite.resources) {
            let quantity = resource.quantity;
            while (quantity > 0) {
                let item = {...sortItems(bank).find(i => i.id === resource.item.id && i.quantity > 0)};
                sortItems(bank).find(i => i.id === resource.item.id && i.quantity > 0).quantity -= quantity;
                quantity -= item.quantity;
                if (quantity < 0) item.quantity += quantity;
                items.push(item)
            }
        }
        await built(locals.user.game_id, bank.filter(i => i.quantity > 0), id, locals.rethinkdb);
        completed = true;
    } else {
        await build(locals.user.game_id, ap, id, locals.rethinkdb);
    }
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'build', { ap, completed, defense: worksite.defense, items, name: worksite.name, warning }, locals.user.gender, locals.user.color, locals.rethinkdb);
    throw redirect(303, '/encampment');
}

export const actions = { blueprint, deposit, map, withdraw, worksite };
