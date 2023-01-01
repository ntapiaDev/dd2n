import { fail, redirect } from '@sveltejs/kit';
import { generateMap } from '../../../utils/map';
import { addUser, getByUsername, setSession } from '../../../utils/users';

const register = async ({ cookies, locals, request }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) return fail(400, { invalid: true });

    const user = await getByUsername(username, locals.rethinkdb);
    if (user) return fail(400, { user: true });

    // REGEX (server + front?)

    const { user_id, SESSIONID } = await addUser({ username, password }, locals.rethinkdb)

    // Création de la carte du joueur
    const map_id = await generateMap(user_id, locals.rethinkdb);
    // Mettre le map_id dans le user??

    // Connexion automatique?
    setSession(cookies, SESSIONID);
    throw redirect(303, '/')

    // Sinon message de succès (flash?) et redirect login
    // throw redirect(303, '/login')
}

export const actions = { register };
