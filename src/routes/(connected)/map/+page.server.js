import { fail, redirect } from "@sveltejs/kit";
import { calcul_attack, critical_chance, empty_1, empty_2, empty_3, empty_building, wound_armed, wound_unarmed } from "$lib/config";
import { canTravel } from '$lib/game';
import { getBlueprints, getItem, getPool, getXp, handleBag, handlePlus, handleSearch, handleStack } from "$lib/loots";
import { checkHT, getDefense, levelUp } from "$lib/player";
import { add_tchat, altar_collapse, get_cell, get_map, get_zombies, kill_zombies, remove_user_from_location, update_building, update_items, update_map, update_search } from "$lib/server/cells";
import { add_user_to_encampment, get_encampment, update_attack } from "$lib/server/encampments";
import { add_unique } from "$lib/server/games";
import { get_from, get_items_by_code, get_loots } from "$lib/server/items";
import { add_log, add_logs, get_logs_by_coordinate } from "$lib/server/logs";
import { _attack, enter_encampment, _force, loot, lose_ap, _search, _travel } from "$lib/server/users";
import { get_recipes } from "$lib/server/workshop";
import { get_worksites_by_group } from "$lib/server/worksites";

export async function load({ locals }) {
    const logs = await get_logs_by_coordinate(locals.user.game_id, locals.user.location, locals.rethinkdb);
    const rows = await get_map(locals.user.game_id, locals.rethinkdb);
    return { logs, rows };
}

const altar = async ({ locals }) => {
    if (locals.user.ap === 0) return fail(400, { exhausted: true });
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);    
    if (!location.altar) return fail(400, { altar: true });
    if (location.zombies > getDefense(locals.user.slots)) return fail(400, { accessAltar: true });
    const teddies = location.items.filter(i => i.class === 'teddy');
    let bp = '';
    if (teddies.length === 3) {
        bp = await get_from('altar', locals.rethinkdb);
        await altar_collapse(locals.user.game_id, locals.user.location, bp, locals.rethinkdb);
    }
    await lose_ap(locals.user.id, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'altar', { teddies, bp }, locals.user.gender, locals.user.color, locals.rethinkdb);
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
    if (item.weapon && item.weapon !== slots.W3.weapon) return fail(400, { ammo: true });
    let wound = locals.user.wound;
    if (wound > 1 && !['W2', 'W4'].includes(item.slot)) return fail(400, { wounded: true });
    let ammo = false;
    let broken = false;
    let force = locals.user.force;
    let woundedW0 = false;
    let woundedW1 = false;
    // Attaque sans arme
    if (item.slot === 'W0' && Math.random() > wound_unarmed) {
        wound += 1;
        woundedW0 = wound;
    }
    // Attaque à l'arme blanche
    else if (item.slot === 'W1') {
        item.durability -= 1;
        if (item.durability === 0) {
            slots['W1'] = '';
            broken = true;
        }
        if (Math.random() > wound_armed) {
            wound += 1;
            woundedW1 = wound;
        }
    }
    // Attaque à l'arme à feu
    else if (item.slot === 'W2') {
        slots['W3'].quantity -= 1;
        if (slots['W3'].quantity === 0) {
            slots['W3'] = '';
            ammo = true;
        }
    }
    // Attaque à l'explosif
    else if (item.slot === 'W4') {
        slots['W4'].quantity -= 1;
        if (slots['W4'].quantity === 0) {
            slots['W4'] = '';
        }
        if (item.description === 'Une grenade fumigène' && !force) force = true;
    }
    // Coup normal
    let plus = item.plus ?? 0;
    const zombies = location.zombies;
    location.zombies -= item.attack;
    if (location.zombies < 0) {
        plus += location.zombies;
        location.zombies = 0;
    }
    const killed = zombies - location.zombies;
    // Coup critique
    let critical = 0;
    if (location.zombies > 0 && Math.random() > critical_chance) {
        location.zombies -= (Math.ceil(item.attack * Math.random()));
        if (location.zombies < 0) location.zombies = 0;
        critical = zombies - killed - location.zombies;
    }
    const stats = locals.user.stats;
    stats.xp += (killed + critical);
    stats.zombies += (killed + critical);
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst, 1);
    await kill_zombies(locals.user.game_id, location.coordinate, killed + critical, locals.rethinkdb);
    await _attack(locals.user.id, locals.user.ap - 1, force, hunger, slots, stats, thirst, wound, killed + critical, locals.rethinkdb);
    const z = await get_zombies(locals.user.game_id, locals.rethinkdb);
    await update_attack(locals.user.game_id, calcul_attack(locals.game.day, z), locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'kill', { 'zombies': killed, 'weapon': item.slot !== 'W0' ? item.description : 'Ses poings', plus, ammo, broken, levelUp: levelUp(locals.user.xp, killed + critical), woundedW0, woundedW1, critical, warning, xp: killed + critical }, locals.user.gender, locals.user.color, locals.rethinkdb);
    throw redirect(303, '/map');
}

const building = async ({ locals }) => {
    if (locals.user.ap === 0) return fail(400, { exhausted: true });
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);    
    if (!location.building) return fail(400, { building: true });
    if (location.building.empty) return fail(400, { emptyBuilding: true });
    if (location.building.searchedBy.includes(locals.user.id)) return fail(400, { searchedBuilding: true });
    if (location.zombies > getDefense(locals.user.slots)) return fail(400, { access: true });
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    const itemList = await get_items_by_code(location.building.code, locals.rethinkdb);
    const recipes = await get_recipes(locals.rethinkdb);
    const worksites = await get_worksites_by_group(locals.rethinkdb);
    const advance = location.building.code === 'b2' ? false : (location.building.code === 'b4' ? true : 'none');
    const blueprints = getBlueprints(encampment, recipes, worksites, advance);
    let pool = getPool(itemList.concat(blueprints), 0, locals.game.uniques);
    const { cache, items, loots, uniques } = handleSearch(location.items, pool, 'building');
    let plus = handlePlus(loots);
    let empty = Math.random() > empty_building;
    const stats = locals.user.stats;
    stats.items += (loots.length + cache.map(i => i.quantity).reduce((a, b) => a + b, 0));
    stats.xp += getXp([...loots, ...cache]);
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst, 1);
    await update_building(locals.user.game_id, locals.user.id, location.coordinate, items, empty, locals.rethinkdb);
    await _search(locals.user.id, locals.user.ap - 1, hunger, stats, thirst, getXp([...loots, ...cache]), locals.rethinkdb);
    if (uniques.length) await add_unique(locals.user.game_id, uniques, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'building', { cache, loots, plus, 'emptyBuilding': empty, levelUp: levelUp(locals.user.xp, getXp([...loots, ...cache])), warning, xp: getXp([...loots, ...cache]) }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

const drop = async ({ locals, request }) => {
    const data = await request.formData();
    const origin = data.get('origin');
    const uuid = data.get('uuid');
    const target = origin === 'inventory' ? locals.user.inventory : origin === 'bag1' ? locals.user.bag1 : locals.user.bag2;
    if (!target.some(i => i.uuid === uuid)) return fail(400, { origin: true });    
    const { item } = getItem(target, uuid, false);
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    const items = handleStack(location.items, item);
    await update_items(locals.user.game_id, locals.user.location, items, locals.rethinkdb);
    await loot(locals.user.id, origin, target, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'drop', { item }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

const encampment = async ({ locals }) => {
    if (locals.user.location !== locals.game.encampment) return fail(400, { encampment: true });
    await remove_user_from_location(locals.user.game_id, locals.user.username, locals.user.location, locals.rethinkdb);
    await add_user_to_encampment(locals.user.game_id, locals.user.username, locals.rethinkdb);
    await enter_encampment(locals.user.id, locals.rethinkdb);
    await add_logs(locals.user.game_id, [
        { coordinate: locals.game.encampment, player: locals.user.username, action: 'outEncampment', log: '', gender: locals.user.gender, color: locals.user.color },
        { coordinate: 'Encampment', player: locals.user.username, action: 'inEncampment', log: '', gender: locals.user.gender, color: locals.user.color }
    ], locals.rethinkdb);
    throw redirect(303, '/encampment');
}

const force = async ({ locals }) => {
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    if (location.zombies <= getDefense(locals.user.slots)) return fail(400, { clear: true });
    if (locals.user.wound > 1) return fail(400, { force: true });
    await _force(locals.user.id, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'force', { wound: true }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

const pickUp = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    const items = location.items;
    if (!items.some(i => i.uuid === uuid)) return fail(400, { origin: true });
    const { item } = getItem(items, uuid, true);
    const { destination, target } = handleBag(item, locals.user);
    if (destination === 'full') return fail(400, { full: true });
    await update_items(locals.user.game_id, locals.user.location, items, locals.rethinkdb);
    await loot(locals.user.id, destination, target, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'pickup', { item }, locals.user.gender, locals.user.color, locals.rethinkdb);
    throw redirect(303, '/map');
}

const search = async ({ locals }) => {
    if (locals.user.ap === 0) return fail(400, { exhausted: true });
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    if (location.empty) return fail(400, { empty: true });
    if (location.searchedBy.includes(locals.user.id)) return fail(400, { searched: true });
    const danger = location.layout.danger;
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    const itemList = await get_loots(locals.rethinkdb);
    const recipes = await get_recipes(locals.rethinkdb);
    const worksites = await get_worksites_by_group(locals.rethinkdb);
    const blueprints = getBlueprints(encampment, recipes, worksites, 'all');
    let pool = getPool(itemList.concat(blueprints), danger, locals.game.uniques);
    const { cache, items, loots, uniques } = handleSearch(location.items, pool, 'search');
    let plus = handlePlus(loots);
    let empty = Math.random() > (danger === 1 ? empty_1 : danger === 2 ? empty_2 : empty_3);
    const stats = locals.user.stats;
    stats.items += (loots.length + cache.map(i => i.quantity).reduce((a, b) => a + b, 0));
    stats.xp += getXp([...loots, ...cache]);
    if (loots.some(i => i.type === 'blueprint'))
        for (let loot of loots.filter(i => i.type === 'blueprint')) {
            if (loot.worksite_id) stats.blueprint += 1;
            else stats.recipe += 1;
        }
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst, 1);
    await update_search(locals.user.game_id, locals.user.id, location.coordinate, items, empty, locals.rethinkdb)
    await _search(locals.user.id, locals.user.ap - 1, hunger, stats, thirst, getXp([...loots, ...cache]), locals.rethinkdb);
    if (uniques.length) await add_unique(locals.user.game_id, uniques, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'loot', { cache, loots, plus, 'empty': empty, levelUp: levelUp(locals.user.xp, getXp([...loots, ...cache])), warning, xp: getXp([...loots, ...cache]) }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

const tchat = async ({ locals, request }) => {
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    if (location.tchat.includes(locals.user.id)) return fail(400, { tchat: true });
    const data = await request.formData();
    const message = data.get('message');
    if (message.length < 3) return fail(400, { short: true });
    if (message.length > 100) return fail(400, { long: true });
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'tchat', { message }, locals.user.gender, locals.user.color, locals.rethinkdb);
    await add_tchat(locals.user.game_id, locals.user.id, locals.user.location, locals.rethinkdb);
}

const travel = async ({ locals, request }) => {
    if (locals.user.ap === 0) return fail(400, { exhausted: true })
    const data = await request.formData();
    const getTarget = data.get('target');
    if (locals.user.location === getTarget) return fail(400, { location: true })
    const location = await get_cell(locals.user.game_id, locals.user.location, locals.rethinkdb);
    let actionIn;
    let actionOut;
    let target;
    if (getTarget) {
        if (location.zombies > getDefense(locals.user.slots) && !locals.user.force) return fail(400, { blocked: true });
        const cell = await get_cell(locals.user.game_id, getTarget, locals.rethinkdb);
        target = cell.coordinate;
        if (!canTravel(location.coordinate, target, cell.layout.border)) return fail(400, { direction: true });
        actionIn = 'in';
        actionOut = 'out';
    } else {
        if (!location.entrance) return fail(400, { tunnel: true });    
        target = location.entrance;
        actionIn = 'inTunnel';
        actionOut = 'outTunnel';
    }    
    const estimated = {
        empty: location.empty,
        zombies: location.zombies
    }
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst, 1);
    await update_map(locals.user.game_id, locals.user.username, location.coordinate, target, estimated, locals.rethinkdb);
    await _travel(locals.user.id, target, locals.user.ap - 1, hunger, thirst, locals.rethinkdb);
    await add_logs(locals.user.game_id, [
        { coordinate: location.coordinate, player: locals.user.username, action: actionOut, log: '', gender: locals.user.gender, color: locals.user.color },
        { coordinate: target, player: locals.user.username, action: actionIn, log: { warning }, gender: locals.user.gender, color: locals.user.color }
    ], locals.rethinkdb);
}

export const actions = { altar, attack, building, drop, encampment, force, pickUp, search, tchat, travel };
