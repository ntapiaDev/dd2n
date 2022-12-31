import bcrypt from 'bcrypt';
import { fail, redirect } from '@sveltejs/kit';
import { getByUsername, refreshSESSIONID } from '../../../utils/users';

const login = async ({ cookies, locals, request }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) return fail(400, { invalid: true });

    const user = await getByUsername(username, locals.rethinkdb);
    console.log(user);
    if (!user) return fail(400, { credentials: true });

    // const checkPassword = await bcrypt.compare(password, user.password);
    // if (!checkPassword) return fail(400, { credentials: true });

    const NEW_SESSIONID = await refreshSESSIONID(user.sessionid, locals.rethinkdb);

    cookies.set('SESSIONID', NEW_SESSIONID, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        //24 heures
        maxAge: 60 * 60 * 24
    })
    throw redirect(303, '/')
}

export const actions = { login };
