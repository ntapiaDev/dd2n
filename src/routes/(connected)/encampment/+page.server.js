import { fail, redirect } from "@sveltejs/kit";
import { add_user_to_location, update_cells } from "$lib/server/cells";
import { get_encampment, remove_user_from_encampment } from "$lib/server/encampments";
import { add_one_day } from "$lib/server/games";
import { add_log, add_logs, get_last_date, get_logs_by_coordinate } from "$lib/server/logs";
import { leave_encampment, update_users } from "$lib/server/users";

export const load = async ({ locals }) => {
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    const lastDate = await get_last_date(locals.user.game_id, locals.game.players.map(p => p.username), locals.rethinkdb);
    const logs = await get_logs_by_coordinate(locals.user.game_id, locals.user.location, locals.rethinkdb);
    return { encampment, lastDate, logs };
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

const nextDay = async ({ locals }) => {
    await add_one_day(locals.user.game_id, locals.rethinkdb);
    const logs = await update_cells(locals.user.game_id, locals.rethinkdb);
    const events = await update_users(locals.user.game_id, locals.rethinkdb);
    if ([...logs, ...events].length) await add_logs(locals.user.game_id, [...logs, ...events], locals.rethinkdb);
}

export const actions = { map, nextDay };
