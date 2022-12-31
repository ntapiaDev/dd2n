import { fail, redirect } from '@sveltejs/kit';
import { addUser, getByUsername } from '../../../utils/users';

const register = async ({ cookies, locals, request }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) return fail(400, { invalid: true });

    const user = await getByUsername(username, locals.rethinkdb);
    if (user) return fail(400, { user: true });

    // REGEX (server + front?)

    const SESSIONID = await addUser({ username, password }, locals.rethinkdb)
    console.log(SESSIONID);

    // Connexion automatique?
    // setSession(cookies, SESSIONID);
    // throw redirect(303, '/')

    throw redirect(303, '/login')
}

export const actions = { register };
