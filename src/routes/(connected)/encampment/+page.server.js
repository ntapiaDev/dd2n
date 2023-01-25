import { fail, redirect } from "@sveltejs/kit";
import { add_user_to_location } from "$lib/server/cells";
import { get_encampment, remove_user_from_encampment } from "$lib/server/encampments";
import { add_log, get_last_date } from "$lib/server/logs";
import { leave_encampment } from "$lib/server/users";

export const load = async ({ locals }) => {
    const encampment = await get_encampment(locals.user.game_id, locals.rethinkdb);
    const lastDate = await get_last_date(locals.user.game_id, locals.game.players.map(p => p.username), locals.rethinkdb);
    return { encampment, lastDate };
}

const map = async ({ locals }) => {
    await remove_user_from_encampment(locals.user.game_id, locals.user.username, locals.rethinkdb);
    await add_user_to_location(locals.user.game_id, locals.user.username, locals.game.encampment, locals.rethinkdb);
    await leave_encampment(locals.user.id, locals.rethinkdb);
    await add_log(locals.user.game_id, locals.game.encampment, locals.user.username, 'inEncampment', '', locals.user.gender, locals.user.color, locals.rethinkdb);
    throw redirect(303, '/map');
}

export const actions = { map };
