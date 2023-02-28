import { fail, redirect } from "@sveltejs/kit";
import { getTavernAction } from "$lib/game";
import { findOrigin, getItem, handleBag, handleStack, sortItems } from "$lib/loots";
import { checkHT, getPAMax, levelUp } from "$lib/player";
import { checkResources, isBlocked, updateBank } from "$lib/worksites";
import { add_user_to_location } from "$lib/server/cells";
import { add_meal, add_recipe, add_reload, add_worksite, build, built, do_reload, do_tavern, get_encampment, get_bank, remove_user_from_encampment, unlock_tavern, unlock_workshop, update_bank } from "$lib/server/encampments";
import { add_log, add_logs, get_last_date, get_logs_by_coordinate } from "$lib/server/logs";
import { add_square, delete_square_by_id, edit_square, get_square, get_square_by_id } from "$lib/server/square";
import { empty_loots, get_slots_by_game, leave_encampment, loot, _meal, update_stats, use_item } from "$lib/server/users";
import { get_recipe, get_recipes } from "$lib/server/workshop";
import { get_tavern, get_worksite, get_worksites_by_group } from "$lib/server/worksites";

export const load = async ({ locals }) => {
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    const lastDate = await get_last_date(locals.user.game_id, locals.game.players.map(p => p.username), locals.rethinkdb);
    const logs = await get_logs_by_coordinate(locals.user.game_id, locals.user.location, locals.rethinkdb);
    const recipes = await get_recipes(locals.rethinkdb);
    const square = await get_square(locals.user.game_id, locals.rethinkdb);
    const slots = await get_slots_by_game(locals.user.game_id, locals.rethinkdb);
    const tavern = await get_tavern(locals.rethinkdb);
    const worksites = await get_worksites_by_group(locals.rethinkdb);
    return { encampment, lastDate, logs, recipes, square, slots, tavern, worksites };
}

const blueprint = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const { origin, target } = findOrigin(locals.user.bag1, locals.user.bag2, locals.user.inventory, uuid);
    if (!origin) return fail(400, { item: true });  
    const { item } = getItem(target, uuid, false);
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    let unlocked;
    if (item.recipe_id) {
        const id = item.recipe_id;
        if (encampment.workshop.recipes.includes(id)) return fail(400, { recipe: true });
        unlocked = await get_recipe(id, locals.rethinkdb);
        unlocked.type = 'recipe';
        await add_recipe(locals.user.game_id, id, locals.rethinkdb);
    }
    else if (item.worksite_id) {
        const id = item.worksite_id;
        if (encampment.worksites.completed.includes(id)) return fail(400, { completed: true });
        else if (encampment.worksites.unlocked.some(w => w.id === id)) return fail(400, { already: true });
        unlocked = await get_worksite(id, locals.rethinkdb);
        unlocked.type = 'worksite';
        await add_worksite(locals.user.game_id, unlocked.ap, id, locals.rethinkdb);
    }
    await use_item(locals.user.id, origin, item, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'blueprint', { name: unlocked.name ?? unlocked.left.name, type: unlocked.type }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

const deposit = async ({ locals, request }) => {
    const data = await request.formData();
    const origin = data.get('origin');
    const uuid = data.get('uuid');
    const target = origin === 'inventory' ? locals.user.inventory : origin === 'bag1' ? locals.user.bag1 : locals.user.bag2;
    if (!target.some(i => i.uuid === uuid)) return fail(400, { origin: true });   
    const { item } = getItem(target, uuid, false);
    const bank = await get_bank(locals.user.game_id, locals.rethinkdb);
    const items = handleStack(bank, item);
    await update_bank(locals.user.game_id, items, locals.rethinkdb);
    await loot(locals.user.id, origin, target, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'deposit', { item }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

const empty = async ({ locals }) => {
    if (!locals.user.bag1.length && !locals.user.bag2.length && !locals.user.inventory.length) return fail(400, { empty: true });  
    const items = [];
    for (let item of sortItems([...locals.user.bag1, ... locals.user.bag2, ...locals.user.inventory])) handleStack(items, item);
    const bank = await get_bank(locals.user.game_id, locals.rethinkdb);
    for (let item of items) handleStack(bank, item);
    await update_bank(locals.user.game_id, bank, locals.rethinkdb);
    await empty_loots(locals.user.id, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'empty', { items }, locals.user.gender, locals.user.color, locals.rethinkdb);
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

const meal = async ({ locals }) => {
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    const level = encampment.tavern.level;
    if (level < 0) return fail(400, { teddies: true });
    else if (level === 0) return fail(400, { works: true });
    else if (encampment.tavern.players.includes(locals.user.username)) return fail(400, { players: true });
    let hunger = locals.user.hunger;
    let thirst = locals.user.thirst;
    if (hunger > 75 && thirst > 75) return fail(400, { meal: true });
    hunger += level * 10;
    if (hunger > 100) hunger = 100;
    let fed = hunger - locals.user.hunger;
    thirst += level * 10;
    if (thirst > 100) thirst = 100;
    fed += thirst - locals.user.thirst;
    let ap = locals.user.ap + Math.floor(fed/10);
    if (ap > getPAMax(locals.user.xp)) ap = getPAMax(locals.user.xp);
    await _meal(locals.user.id, ap, hunger, thirst, locals.rethinkdb);
    await add_meal(locals.user.game_id, locals.user.username, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'meal', { action: getTavernAction(), teddy: Math.floor(Math.random() * 3), value: ap - locals.user.ap }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

const square = async ({ locals, request }) => {
    const data = await request.formData();
    let category = data.get('category');
    if (!category) return fail(400, { category: true });
    else if (!['motd', 'urgent', 'bank', 'worksites', 'workshop', 'edit'].includes(category)) return fail(400, { invalid: true });
    const message = data.get('message');
    if (message.length < 3) return fail(400, { short: true });
    if (message.length > 200) return fail(400, { long: true });
    const id = data.get('id');
    let mode = 'add';
    if (id) {
        const square = await get_square_by_id(id, locals.rethinkdb);
        if (!square) return fail(400, { square: true });
        if (square.category === 'motd' && data.get('delete') === 'true') return fail(400, { motd: true });
        else if (square.category !== 'motd' && square.username === 'Gardien' && data.get('delete') === 'false') return fail(400, { edit: true });
        else if (square.category !== 'motd' && square.username !== locals.user.username && square.username !== 'Gardien') return fail(400, { owner: true });
        category = square.category;
        if (data.get('delete') === 'true') {
            await delete_square_by_id(id, locals.rethinkdb);
            mode = 'delete';
        } else {
            await edit_square(id, locals.user.color, message, locals.user.username, locals.rethinkdb);
            mode = 'edit';
        }
    } else {
        const square = await get_square(locals.user.game_id, locals.rethinkdb);
        const messages = square.filter(m => m.username === locals.user.username && m.category === category);
        if (['motd', 'urgent'].includes(category) && messages.length > 0
            || ['bank', 'worksites', 'workshop'].includes(category) && messages.length > 2) return fail(400, { toMany: true });
        await add_square(locals.user.game_id, locals.user.color, category, message, locals.user.username, locals.rethinkdb);
    }
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'square', { category, mode }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

const tavern = async ({ locals, request }) => {
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    if (encampment.tavern.level < 0) return fail(400, { teddies: true });
    if (locals.user.wound > 1) return fail(400, { wounded: true });
    const data = await request.formData();
    const ap = parseInt(data.get('ap'));
    if (!ap) return fail(400, { nothing: true });
    else if (ap > locals.user.ap) return fail(400, { ap: true });
    const id = data.get('id');
    if (encampment.tavern.completed.includes(id)) return fail(400, { completed: true });
    const worksite = await get_worksite(id, locals.rethinkdb);
    if (encampment.tavern.level < worksite.level - 1) return fail(400, { unlocked: true });
    else if (encampment.tavern.unlocked.find(w => w.id === id).ap < ap) return fail(400, { toMuch: true });
    else if (!checkResources(encampment.items, worksite.resources, ap, false, false)) return fail(400, { resources: true });
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst, ap);
    let wound = locals.user.wound;
    let wounded = 0;
    if (ap / 200 > Math.random()) {
        wound++;
        wounded = wound;
    }
    await update_stats(locals.user.id, ap, hunger, thirst, wound, 'worksite', locals.rethinkdb);
    let completed = false;
    let items = [];
    if (encampment.tavern.unlocked.find(w => w.id === id).ap === ap) {
        const [bank, i] = updateBank(worksite.resources, encampment.items, 1, false, false);
        completed = true;
        items = i;
        await do_tavern(locals.user.game_id, bank.filter(i => i.quantity > 0), id, worksite.level, locals.rethinkdb);
    } else {
        await build(locals.user.game_id, ap, id, 'tavern', locals.rethinkdb);
    }
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'tavern', { ap, completed, items, level: worksite.level, levelUp: levelUp(locals.user.xp, ap), name: worksite.name, warning, wounded,xp: ap }, locals.user.gender, locals.user.color, locals.rethinkdb);
    throw redirect(303, '/encampment');
}

const unlock = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const { origin, target } = findOrigin(locals.user.bag1, locals.user.bag2, locals.user.inventory, uuid);
    if (!origin) return fail(400, { item: true });    
    const { item } = getItem(target, uuid, false);
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    if (item.origin === 'altar') {
        if (encampment.tavern.level >= 0) return fail(400, { tavern: true });
        await unlock_tavern(locals.user.game_id, locals.rethinkdb);
    } else if (item.origin === 'workshop') {
        if (encampment.workshop.unlocked) return fail(400, { workshop: true });
        await unlock_workshop(locals.user.game_id, locals.rethinkdb);
    }
    await use_item(locals.user.id, origin, item, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'unlocked', { origin: item.origin }, locals.user.gender, locals.user.color, locals.rethinkdb);
}

const upgrade = async ({ locals, request }) => {
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    if (!encampment.workshop.unlocked) return fail(400, { locked: true });
    if (1 > locals.user.ap) return fail(400, { ap: true });
    const data = await request.formData();
    const uuid = data.get('uuid');
    const _bank = await get_bank(locals.user.game_id, locals.rethinkdb);
    const item = _bank.find(i => i.uuid === uuid);
    if (_bank.filter(material => material.id === item.id && material.plus === item.plus).length < 2 && item.quantity < 2) return fail(400, { materials: true });
    const upgraded = { ...item, plus: item.plus + 1, quantity: 1, uuid: crypto.randomUUID()};
    if (item.attack) upgraded.attack += 1;
    if (item.capacity) upgraded.capacity += 1;
    if (item.defense) upgraded.defense += 1;
    if (item.durability) upgraded.durability = item.durabilityMax;
    const [bank, items] = updateBank([{ item, quantity: 2 }], _bank, 1, false, false, true);
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst, 1);
    await update_stats(locals.user.id, 1, hunger, thirst, locals.user.wound, 'workshop', locals.rethinkdb);
    await update_bank(locals.user.game_id, handleStack(bank.filter(i => i.quantity > 0), upgraded), locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'upgrade', { item: upgraded, items, levelUp: levelUp(locals.user.xp, 1), warning, xp: 1 }, locals.user.gender, locals.user.color, locals.rethinkdb);
    throw redirect(303, '/encampment');
}

const withdraw = async ({ locals, request }) => {
    const data = await request.formData();
    const uuid = data.get('uuid');
    const bank = await get_bank(locals.user.game_id, locals.rethinkdb);
    if (!bank.some(i => i.uuid === uuid)) return fail(400, { origin: true });
    const { item } = getItem(bank, uuid, true);
    const { destination, target } = handleBag(item, locals.user);
    if (destination === 'full') return fail(400, { full: true });
    await update_bank(locals.user.game_id, bank, locals.rethinkdb);
    await loot(locals.user.id, destination, target, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'withdraw', { item }, locals.user.gender, locals.user.color, locals.rethinkdb);
    throw redirect(303, '/encampment');
}

const workshop = async ({ locals, request }) => {
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    if (!encampment.workshop.unlocked) return fail(400, { locked: true });
    const data = await request.formData();
    const ap = parseInt(data.get('ap'));
    if (ap > locals.user.ap) return fail(400, { ap: true });
    const id = data.get('id');
    if (!encampment.workshop.recipes.includes(id)) return fail(400, { unknown: true });
    const recipe = await get_recipe(id, locals.rethinkdb);
    if (ap < recipe.left.ap) return fail(400, { more: true });
    if (!checkResources(encampment.items, recipe.left.resources, 1, false, false)) return fail(400, { materials: true });
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst, ap);
    await update_stats(locals.user.id, ap, hunger, thirst, locals.user.wound, 'workshop', locals.rethinkdb);
    const [bank, items] = updateBank(recipe.left.resources, encampment.items, 1, false, false);
    const product = recipe.right;
    if (product.durabilityMax) product.durability = product.durabilityMax;
    if (['bag', 'weapon', 'armour'].includes(product.type)) product.plus = 0;
    product.quantity = recipe.left.quantity;
    product.uuid = crypto.randomUUID();
    await update_bank(locals.user.game_id, handleStack(bank.filter(i => i.quantity > 0), product), locals.rethinkdb);
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'workshop', { item: product, items, levelUp: levelUp(locals.user.xp, ap), warning, xp: ap }, locals.user.gender, locals.user.color, locals.rethinkdb);
    throw redirect(303, '/encampment');
}

const worksite = async ({ locals, request }) => {
    if (locals.user.wound > 1) return fail(400, { wounded: true });
    const data = await request.formData();
    const ap = parseInt(data.get('ap'));
    if (!ap) return fail(400, { nothing: true });
    else if (ap > locals.user.ap) return fail(400, { ap: true });
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    const id = data.get('id');
    const reload = encampment.worksites.reload;
    const unlocked = encampment.worksites.unlocked;
    const worksites = await get_worksites_by_group(locals.rethinkdb);
    const worksite = worksites.find(g => g.reduction.find(w => w.id === id)).reduction.find(w => w.id === id);
    const reloading = reload.some(r => r.id === worksite.id);
    if (encampment.worksites.completed.includes(id) && (!worksite.reload || reload.find(r => r.id === worksite.id).ap > 0)) return fail(400, { completed: true });
    else if (!unlocked.some(w => w.id === id) && !reload.some(r => r.id === worksite.id)) return fail(400, { unlocked: true });
    else if (
        !worksite.reload && unlocked.find(w => w.id === id).ap < ap ||
        worksite.reload && 10 < ap) return fail(400, { toMuch: true });
    if (worksite.parent && isBlocked(worksite, encampment.worksites.completed, worksites)) return fail(400, { unlocked: true });
    if (!checkResources(encampment.items, worksite.resources, ap, worksite.reload, reloading)) return fail(400, { resources: true });
    const { hunger, thirst, warning } = checkHT(locals.user.hunger, locals.user.thirst, ap);
    let wound = locals.user.wound;
    let wounded = 0;
    if (ap / 200 > Math.random()) {
        wound++;
        wounded = wound;
    }
    await update_stats(locals.user.id, ap, hunger, thirst, wound, 'worksite', locals.rethinkdb);
    let completed = false;
    let items = [];
    let type = '';
    if (worksite.reload) {
        const [bank, i] = updateBank(worksite.resources, encampment.items, ap, true, reloading);
        completed = true;
        items = i;
        type = reloading ? 'reloading' : 'reload';
        if (reloading) {
            await update_bank(locals.user.game_id, bank.filter(i => i.quantity > 0), locals.rethinkdb);
            await do_reload(locals.user.game_id, id, ap, locals.rethinkdb);
        }
        else {
            await built(locals.user.game_id, bank.filter(i => i.quantity > 0), id, locals.rethinkdb);
            await add_reload(locals.user.game_id, id, ap, locals.rethinkdb);
        }
    }
    else if (unlocked.find(w => w.id === id).ap === ap) {
        const [bank, i] = updateBank(worksite.resources, encampment.items, 1, false, false);
        completed = true;
        items = i;
        if (worksite.temporary) type = 'temporary';
        await built(locals.user.game_id, bank.filter(i => i.quantity > 0), id, locals.rethinkdb);
    } else {
        await build(locals.user.game_id, ap, id, 'worksites', locals.rethinkdb);
    }
    await add_log(locals.user.game_id, locals.user.location, locals.user.username, 'build', { ap, completed, defense: worksite.defense * (worksite.reload ? ap : 1), items, levelUp: levelUp(locals.user.xp, ap), name: worksite.name, type, warning, wounded, xp: ap }, locals.user.gender, locals.user.color, locals.rethinkdb);
    throw redirect(303, '/encampment');
}

export const actions = { blueprint, deposit, empty, map, meal, square, tavern, unlock, upgrade, withdraw, workshop, worksite };
