import { fail, redirect } from "@sveltejs/kit";
import { calcul_attack } from "$lib/config";
import { generate_cells, delete_cells, remove_user_from_location } from "$lib/server/cells";
import { add_user_to_encampment, delete_encampment, generate_encampment, remove_user_from_encampment } from "$lib/server/encampments";
import { add_game, add_user_to_game, delete_game, get_games, get_game_by_id, remove_user_from_game, set_private } from "$lib/server/games"
import { get_from } from "$lib/server/items";
import { add_log, add_logs, delete_logs } from "$lib/server/logs";
import { add_squares, delete_square } from "$lib/server/square";
import { add_game_to_user, remove_game_from_user, remove_game_from_users } from "$lib/server/users";
import { get_recipes } from "$lib/server/workshop";
import { get_tavern, get_worksites } from "$lib/server/worksites";

export const load = async ({ locals }) => {
    const games = await get_games(locals.rethinkdb);
    return { games };
}

const addGame = async ({ locals }) => {
    if (locals.user.role !== 'admin') return fail(400, { admin: true });
    const tavern = (await get_tavern(locals.rethinkdb)).map(({completed, defense, description, level, name, parent, rarity, resources, type, unlocked, ...rest}) => rest);
    const worksites = await get_worksites(locals.rethinkdb);
    const completed = worksites.filter(w => w.completed).map(w => w.id);
    const unlocked = worksites.filter(w => w.unlocked && !w.completed).map(({advance, completed, defense, description, name, parent, reload, rarity, resources, temporary, type, unlocked, ...rest}) => rest);
    const workshop = await get_recipes(locals.rethinkdb);
    const recipes = workshop.filter(w => w.left.unlocked).map(w => w.left.id);
    const blueprint = await get_from('workshop', locals.rethinkdb);
    const game_id = await add_game(locals.rethinkdb);
    const { teddies, total_zombies, ws } = await generate_cells(game_id, blueprint, locals.rethinkdb);
    await generate_encampment(game_id, calcul_attack(1, total_zombies), completed, tavern, unlocked, recipes, locals.rethinkdb);
    await add_squares(game_id, [
        { color: '#000000', category: 'motd', message: 'Trouver un moyen de débloquer l\'atelier.', username: 'Gardien' },
        { color: '#000000', category: 'bank', message: 'Il nous faut en priorité des ressources pour les chantiers et de la nourriture.', username: 'Gardien' },
        { color: '#000000', category: 'worksites', message: 'Il faut se concentrer sur les chantiers définitifs et ne faire les chantiers temporaires qu\'en cas de nécessité.', username: 'Gardien' },
        { color: '#000000', category: 'worksites', message: 'Nous devons essayer de trouver de nouveaux plans lors de nos expéditions.', username: 'Gardien' },
    ], locals.rethinkdb);
    await add_logs(game_id, [
        { coordinate: 'Encampment', player: '', action: 'gamestart', log: '', gender: '', color: '' },
        { coordinate: teddies[0], player: '', action: 'teddy', log: '', gender: '', color: '' },
        { coordinate: teddies[1], player: '', action: 'teddy', log: '', gender: '', color: '' },
        { coordinate: teddies[2], player: '', action: 'teddy', log: '', gender: '', color: '' },
        { coordinate: ws, player: '', action: 'workshop', log: '', gender: '', color: '' }
    ], locals.rethinkdb);
}

const deleteGame = async ({ locals, request }) => {
    if (locals.user.role !== 'admin') return fail(400, { admin: true });
    const data = await request.formData();
    const game_id = data.get('game_id');
    await delete_game(game_id, locals.rethinkdb);
    await delete_cells(game_id, locals.rethinkdb);
    await delete_encampment(game_id, locals.rethinkdb);
    await delete_square(game_id, locals.rethinkdb);
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
        await add_game_to_user(game_id, locals.user.id, color, locals.user.xp, locals.rethinkdb);
        await add_log(game_id, 'Encampment', locals.user.username, 'newGame', '', locals.user.gender, color, locals.rethinkdb);
        throw redirect(303, '/map');
    }
}

const setPrivate = async ({ locals, request }) => {
    if (locals.user.role !== 'admin') return fail(400, { admin: true });
    const data = await request.formData();
    const game_id = data.get('game_id');
    await set_private(game_id, locals.rethinkdb);
    throw redirect(303, '/');
}

export const actions = { addGame, deleteGame, joinGame, setPrivate };
