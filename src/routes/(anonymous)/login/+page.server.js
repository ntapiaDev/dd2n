import bcrypt from 'bcrypt';
import { fail, redirect } from '@sveltejs/kit';
import { get_by_username, refresh_SESSIONID, setSession } from '$lib/server/users';

const login = async ({ cookies, locals, request }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) return fail(400, { invalid: true });

    const user = await get_by_username(username, locals.rethinkdb);
    if (!user) return fail(400, { credentials: true });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return fail(400, { credentials: true });

    const NEW_SESSIONID = await refresh_SESSIONID(user.sessionid, locals.rethinkdb);

    setSession(cookies, NEW_SESSIONID);
    throw redirect(303, '/')
}

export const actions = { login };
