import { fail, redirect } from "@sveltejs/kit";
import { getAddGame, getDeleteGame, getGameById, getGames, getJoin, getLeave } from "../../utils/games"

export const load = async ({ locals }) => {
    const games = await getGames(locals.rethinkdb);
    return { games };
}

const addGame = async ({ locals }) => {
    if (locals.user.role !== 'admin') return fail(400, { admin: true });
    await getAddGame(locals.rethinkdb);
}

const deleteGame = async ({ locals, request }) => {
    if (locals.user.role !== 'admin') return fail(400, { admin: true });
    const data = await request.formData();
    const id = data.get('id');
    await getDeleteGame(id, locals.rethinkdb);
}

const joinGame = async ({ locals, request }) => {
    const data = await request.formData();
    const id = data.get('id');
    if (locals.user.game && locals.user.game !== id) return fail(400, { already: true });
    if (locals.user.game && locals.user.game === id) {
        await getLeave(id, locals.user.username, locals.rethinkdb);
    } else {
        // Vérifier que la partie n'est pas pleine / que la partie est J1?
        // const game = await getGameById(id, locals.rethinkdb);
        await getJoin(id, locals.user.username, locals.rethinkdb);
    }
    throw redirect(303, '/');
}

export const actions = { addGame, deleteGame, joinGame };
