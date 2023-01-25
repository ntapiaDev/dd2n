import { redirect } from "@sveltejs/kit";
import { update_cells } from "$lib/server/cells";
import { add_one_day } from "$lib/server/games";
import { add_logs } from "$lib/server/logs";
import { update_users } from "$lib/server/users";

export async function load() {
    throw redirect(303, '/');
}

const nextDay = async ({ locals }) => {
    await add_one_day(locals.user.game_id, locals.rethinkdb);
    const logs = await update_cells(locals.user.game_id, locals.rethinkdb);
    const events = await update_users(locals.user.game_id, locals.rethinkdb);
    if ([...logs, ...events].length) await add_logs(locals.user.game_id, [...logs, ...events], locals.rethinkdb);
}

export const actions = { nextDay };
