import { fail, redirect } from "@sveltejs/kit";
import { add_game, delete_game, get_games, get_game_by_id, join_game, leave_game } from "../../utils/games"
import { add_log, delete_logs } from "../../utils/logs";

export const load = async ({ locals }) => {
    const games = await get_games(locals.rethinkdb);
    return { games };
}

const addGame = async ({ locals }) => {
    if (locals.user.role !== 'admin') return fail(400, { admin: true });
    await add_game(locals.rethinkdb);
}

const deleteGame = async ({ locals, request }) => {
    if (locals.user.role !== 'admin') return fail(400, { admin: true });
    const data = await request.formData();
    const game_id = data.get('game_id');
    await delete_game(game_id, locals.rethinkdb);
    await delete_logs(game_id, locals.rethinkdb);
}

const joinGame = async ({ locals, request }) => {
    const data = await request.formData();
    const game_id = data.get('game_id');
    const game = await get_game_by_id(game_id, locals.rethinkdb);
    // if (locals.user.game_id !== 'd95363b8-cf62-4115-8e02-4b1398f7d109') return fail(400, { already: true });
    if (locals.user.game_id === game_id) {
        await add_log(game_id, locals.user.location, locals.user.username, 'leave', '', locals.rethinkdb);
        await leave_game(game_id, locals.user.username, locals.user.location, locals.rethinkdb);
        throw redirect(303, '/');
    } else {
        // Vérifier que la partie n'est pas pleine / que la partie est J1?
        const location = await join_game(game_id, locals.user.username, locals.rethinkdb);
        await add_log(game_id, location, locals.user.username, 'in', { warning: false }, locals.rethinkdb);
        throw redirect(303, '/map');
    }
}

export const actions = { addGame, deleteGame, joinGame };
