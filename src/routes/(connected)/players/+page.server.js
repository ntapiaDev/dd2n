import { get_players } from "$lib/server/users";

export const load = async ({ locals }) => {
    const players = await get_players(locals.user.game_id, locals.rethinkdb);
    return { players };
}
