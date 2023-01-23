import { fail, redirect } from "@sveltejs/kit";
import { add_user_to_encampment, generate_cells, delete_cells, remove_user_from_location } from "$lib/server/cells";
import { add_game, add_user_to_game, delete_game, get_games, get_game_by_id, remove_user_from_game } from "$lib/server/games"
import { add_log, delete_logs } from "$lib/server/logs";
import { add_game_to_user, remove_game_from_user, remove_game_from_users } from "$lib/server/users";

export const load = async ({ locals }) => {
    const games = await get_games(locals.rethinkdb);
    return { games };
}

const addGame = async ({ locals }) => {
    if (locals.user.role !== 'admin') return fail(400, { admin: true });
    const game_id = await add_game(locals.rethinkdb);
    await generate_cells(game_id, locals.rethinkdb);
}

const deleteGame = async ({ locals, request }) => {
    if (locals.user.role !== 'admin') return fail(400, { admin: true });
    const data = await request.formData();
    const game_id = data.get('game_id');
    await delete_game(game_id, locals.rethinkdb);
    await delete_cells(game_id, locals.rethinkdb);
    await remove_game_from_users(game_id, locals.rethinkdb);
    await delete_logs(game_id, locals.rethinkdb);
}

const joinGame = async ({ locals, request }) => {
    const data = await request.formData();
    const game_id = data.get('game_id');
    if (locals.user.game_id && locals.user.game_id !== game_id) return fail(400, { already: true });
    if (locals.user.game_id === game_id) {
        console.log(locals.user);
        await remove_user_from_game(game_id, locals.user.username, locals.rethinkdb);
        await remove_user_from_location(game_id, locals.user.username, locals.user.location, locals.rethinkdb);
        await remove_game_from_user(locals.user.username, locals.rethinkdb);
        await add_log(game_id, locals.user.location, locals.user.username, 'leave', '', locals.user.gender, locals.rethinkdb);
        throw redirect(303, '/');
    } else {
        // Vérifier que la partie n'est pas pleine / que la partie est J1?
        // const game = await get_game_by_id(game_id, locals.rethinkdb);
        const encampment = await add_user_to_game(game_id, locals.user.username, locals.rethinkdb);
        await add_user_to_encampment(game_id, locals.user.username, encampment, locals.rethinkdb);
        await add_game_to_user(game_id, locals.user.id, encampment, locals.rethinkdb);
        await add_log(game_id, encampment, locals.user.username, 'in', { warning: false }, locals.user.gender, locals.rethinkdb);
        throw redirect(303, '/map');
    }
}

export const actions = { addGame, deleteGame, joinGame };
