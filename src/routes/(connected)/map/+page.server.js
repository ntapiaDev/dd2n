import { fail, redirect } from "@sveltejs/kit";
import { canTravel, checkHT, getDefense, getPool, handlePlus, handleSearch, handleStack } from '../../../utils/tools';
import { get_items, get_items_by_code, move_item } from '../../../utils/items';
import { push_through, _attack, _building, _search, _travel } from "../../../utils/maps";
import { add_tchat, get_cell, get_map, update_cells } from "$lib/server/cells";
import { add_log, add_logs, get_logs_by_coordinate } from "$lib/server/logs";
import { add_one_day } from "$lib/server/games";
import { update_users } from "$lib/server/users";

export async function load({ locals }) {
    const logs = await get_logs_by_coordinate(locals.user.game_id, locals.user.location, locals.rethinkdb);
    const rows = await get_map(locals.user.game_id, locals.rethinkdb);
    return { logs, rows };
}

const attack = async ({ locals, request }) => {
    if (locals.user.ap === 0) return fail(400, { exhausted: true });
    const data = await request.formData();
    const id = data.get('id');  
    const slots = locals.user.slots;
    const item = Object.entries(slots).find(slot => slot.find(i => i.id === id))?.find(i => i.id === id);
    if (!item) return fail(400, { item: true });
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    if (location.zombies === 0) return fail(400, { zombies: true });
    // On vérifie que le type de munitions correspond
    if (item.weapon && item.weapon !== slots.W3.weapon) return fail(400, { ammo: true });
    let wound = locals.user.wound;
    if (wound > 1 && !['W2', 'W4'].includes(item.slot)) return fail(400, { wounded: true });
    let ammo = false;
    let broken = false;
    let woundedW0 = false;
    let woundedW1 = false;
    let force = locals.user.force;
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
        if (item.description === 'Une grenade fumigène' && !force) force = true;
    }
    let plus = item.plus ?? 0;
    // Gestion de la qualité de l'arme??
    const zombies = location.zombies;
    location.zombies -= item.attack;
    if (location.zombies < 0) {
        plus += location.zombies;
        location.zombies = 0;
    }
    const killed = zombies - location.zombies;
    // Coup critique
    let critical = 0;
    if (location.zombies > 0 && Math.random() > 0.9) {
        location.zombies -= (Math.ceil(item.attack * Math.random()));
        if (location.zombies < 0) location.zombies = 0;
        critical = zombies - killed - location.zombies;
    }
    // Statistiques nombre de zombies tués
    const stats = locals.user.stats;
    stats.zombies += (killed + critical);
    // Faim et soif capés à 1% la journée
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst);
    await _attack(locals.user.game_id, locals.user.id, location.coordinate, location.zombies, slots, locals.user.ap - 1, hunger, thirst, wound, force, stats, locals.rethinkdb)
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'kill', { 'zombies': killed, 'weapon': item.slot !== 'W0' ? item.description : 'Ses poings', plus, ammo, broken, woundedW0, woundedW1, critical, warning }, locals.rethinkdb);
    throw redirect(303, '/map');
}

const building = async ({ locals }) => {
    if (locals.user.ap === 0) return fail(400, { exhausted: true });
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);    
    if (!location.building) return fail(400, { building: true });
    if (location.building.empty) return fail(400, { emptyBuilding: true });
    if (location.building.searchedBy.includes(locals.user.id)) return fail(400, { searchedBuilding: true });
    if (location.zombies > getDefense(locals.user.slots)) return fail(400, { access: true });

    const code = location.building.code;
    const itemList = await get_items_by_code(code, locals.rethinkdb);

    let pool = getPool(itemList, 0, locals.user.uniques);
    const { items, loots, uniques } = handleSearch(location.items, pool, 'building');
    let plus = handlePlus(loots);
    const stats = locals.user.stats;
    stats.items += loots.length;
    const building = location.building;
    building.empty = Math.random() > 0.9;
    building.searchedBy.push(locals.user.id);
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst);
    await _building(locals.user.game_id, locals.user.id, location.coordinate, items, uniques, building, locals.user.ap - 1, hunger, thirst, stats, locals.rethinkdb)
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'building', { loots, plus, 'emptyBuilding': building.empty, warning }, locals.rethinkdb);
}

const drop = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const inventory = locals.user.inventory;
    if (!inventory.some(i => i.uuid === uuid)) return fail(400, { origin: true });    
    const getItem = (inventory, uuid) => {
        for (let item of inventory) {
            if (item.uuid === uuid) {
                inventory.splice(inventory.indexOf(item), 1);
                return item;
            }
        }
    }
    const item = getItem(inventory, uuid);
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    const items = handleStack(location.items, item);
    const slots = locals.user.slots;
    await move_item(locals.user.game_id, locals.user.id, locals.user.location, items, inventory, slots, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'drop', { item }, locals.rethinkdb);
}

const force = async ({ locals }) => {
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    if (location.zombies <= getDefense(locals.user.slots)) return fail(400, { clear: true });
    if (locals.user.wound > 1) return fail(400, { force: true });
    await push_through(locals.user.id, locals.rethinkdb);
    await add_log(locals.user.id, locals.user.location, locals.user.username, 'force', { wound: true }, locals.rethinkdb);
}

const nextDay = async ({ locals }) => {
    await add_one_day(locals.user.game_id, locals.rethinkdb);
    const logs = await update_cells(locals.user.game_id, locals.rethinkdb);
    const events = await update_users(locals.user.game_id, locals.rethinkdb);
    if ([...logs, ...events].length) await add_logs(locals.user.game_id, [...logs, ...events], locals.rethinkdb);
}

const pickUp = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    const items = location.items;
    if (!items.some(i => i.uuid === uuid)) return fail(400, { origin: true });
    const getItem = (items, uuid) => {
        for (let item of items) {
            if (item.uuid === uuid) {
                if (item.quantity > 1 && !['ammunition', 'explosive'].includes(item.type)) {
                    item.quantity -= 1;
                }
                else items.splice(items.indexOf(item), 1);
                return {...item};
            }
        }
    }
    const item = getItem(items, uuid);
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
    await move_item(locals.user.game_id, locals.user.id, locals.user.location, items, inventory, slots, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'pickup', { item }, locals.rethinkdb);
    throw redirect(303, '/map');
}

const search = async ({ locals }) => {
    if (locals.user.ap === 0) return fail(400, { exhausted: true });
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    const itemList = await get_items(locals.rethinkdb);
    if (location.empty) return fail(400, { empty: true });
    if (location.searchedBy.includes(locals.user.id)) return fail(400, { searched: true });
    const danger = location.layout.danger;
    let pool = getPool(itemList, danger, locals.user.uniques);
    const { items, loots, uniques } = handleSearch(location.items, pool, 'search');
    let plus = handlePlus(loots);
    let empty = Math.random() > (danger === 1 ? 0.5 : danger === 2 ? 0.75 : 0.9);
    const stats = locals.user.stats;
    stats.items += loots.length;
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst);
    await _search(locals.user.game_id, locals.user.id, location.coordinate, items, uniques, empty, locals.user.ap - 1, hunger, thirst, stats, locals.rethinkdb)
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'loot', { loots, plus, 'empty': empty, warning }, locals.rethinkdb);
}

const tchat = async ({ locals, request }) => {
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    if (location.tchat.includes(locals.user.id)) return fail(400, { tchat: true });
    const data = await request.formData();
    const message = data.get('message');
    if (message.length < 3) return fail(400, { short: true });
    if (message.length > 100) return fail(400, { long: true });
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'tchat', { message }, locals.rethinkdb);
    await add_tchat(locals.user.game_id, locals.user.id, locals.user.location, locals.rethinkdb);
}

const travel = async ({ locals, request }) => {
    if (locals.user.ap === 0) return fail(400, { exhausted: true })
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    const data = await request.formData();
    const getTarget = data.get('target');
    let target;
    if (getTarget) {
        if (location.zombies > getDefense(locals.user.slots) && !locals.user.force) return fail(400, { blocked: true });
        const cell = await get_cell(locals.user.game_id, getTarget, locals.rethinkdb);
        target = cell.coordinate;
        if (!canTravel(location.coordinate, target, cell.layout.border)) return fail(400, { direction: true });
    } else {
        if (!location.entrance) return fail(400, { tunnel: true });    
        target = location.entrance;
    }    
    const estimated = {
        empty: location.empty,
        zombies: location.zombies
    }
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst);
    await _travel(locals.user.game_id, locals.user.id, locals.user.username, location.coordinate, target, estimated, locals.user.ap - 1, hunger, thirst, locals.rethinkdb);
    await add_logs(locals.user.game_id, [
        { coordinate: location.coordinate, player: locals.user.username, action: 'out', log: '' },
        { coordinate: target, player: locals.user.username, action: 'in', log: { warning } }
    ], locals.rethinkdb);
}

export const actions = { attack, building, drop, force, nextDay, pickUp, search, tchat, travel };
