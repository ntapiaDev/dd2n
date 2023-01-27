import { fail, redirect } from "@sveltejs/kit";
import { generate_cells, delete_cells, remove_user_from_location } from "$lib/server/cells";
import { add_user_to_encampment, delete_encampment, generate_encampment, remove_user_from_encampment } from "$lib/server/encampments";
import { add_game, add_user_to_game, delete_game, get_games, get_game_by_id, remove_user_from_game } from "$lib/server/games"
import { add_log, add_logs, delete_logs } from "$lib/server/logs";
import { add_game_to_user, remove_game_from_user, remove_game_from_users } from "$lib/server/users";
import { get_worksites } from "$lib/server/worksites";

export const load = async ({ locals }) => {
    const games = await get_games(locals.rethinkdb);
    return { games };
}

const addGame = async ({ locals }) => {
    if (locals.user.role !== 'admin') return fail(400, { admin: true });
    const worksites = await get_worksites(locals.rethinkdb);
    const completed = worksites.filter(w => w.completed).map(w => w.id);
    const unlocked = worksites.filter(w => w.unlocked && !w.completed).map(w => w.id);
    const game_id = await add_game(completed, unlocked, locals.rethinkdb);
    const teddies = await generate_cells(game_id, locals.rethinkdb);
    await generate_encampment(game_id, locals.rethinkdb);
    await add_logs(game_id, [
        { coordinate: teddies[0], player: '', action: 'teddy', log: '', gender: '', color: '' },
        { coordinate: teddies[1], player: '', action: 'teddy', log: '', gender: '', color: '' },
        { coordinate: teddies[2], player: '', action: 'teddy', log: '', gender: '', color: '' }
    ], locals.rethinkdb);
}

const deleteGame = async ({ locals, request }) => {
    if (locals.user.role !== 'admin') return fail(400, { admin: true });
    const data = await request.formData();
    const game_id = data.get('game_id');
    await delete_game(game_id, locals.rethinkdb);
    await delete_cells(game_id, locals.rethinkdb);
    await delete_encampment(game_id, locals.rethinkdb);
    await remove_game_from_users(game_id, locals.rethinkdb);
    await delete_logs(game_id, locals.rethinkdb);
}

const joinGame = async ({ locals, request }) => {
    const data = await request.formData();
    const game_id = data.get('game_id');
    if (locals.user.game_id && locals.user.game_id !== game_id) return fail(400, { already: true });
    if (locals.user.game_id === game_id) {
        if (locals.user.location === 'Encampment') {
            await remove_user_from_encampment(game_id, locals.user.username, locals.rethinkdb);
        } else {
            await remove_user_from_location(game_id, locals.user.username, locals.user.location, locals.rethinkdb);
        }
        await add_log(game_id, locals.user.location, locals.user.username, 'leave', '', locals.user.gender, locals.user.color, locals.rethinkdb);
        await remove_user_from_game(game_id, locals.user.username, locals.user.color, locals.rethinkdb);
        await remove_game_from_user(locals.user.username, locals.rethinkdb);
        throw redirect(303, '/');
    } else {
        // Vérifier que la partie n'est pas pleine / que la partie est J1?
        const game = await get_game_by_id(game_id, locals.rethinkdb);
        const color = data.get('color');
        if (!game.colors.find(c => c.code === color)) return fail(400, { color: true });
        else if (game.colors.find(c => c.code === color).taken) return fail(400, { taken: true });
        await add_user_to_encampment(game_id, locals.user.username, locals.rethinkdb);
        await add_user_to_game(game_id, locals.user.username, color, locals.rethinkdb);
        await add_game_to_user(game_id, locals.user.id, color, locals.rethinkdb);
        await add_log(game_id, 'Encampment', locals.user.username, 'newGame', '', locals.user.gender, color, locals.rethinkdb);
        throw redirect(303, '/map');
    }
}

export const actions = { addGame, deleteGame, joinGame };
