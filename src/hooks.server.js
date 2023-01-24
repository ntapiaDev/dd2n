import r from 'rethinkdb';
import { HOST, PORT, DB, USER, PASSWORD } from '$env/static/private';
import { get_by_SESSIONID } from '$lib/server/users';

const redirect = (location) =>
    new Response(null, {
        status: 307,
        headers: { location }
    });

export const handle = async ({ event, resolve }) => {
    const rethinkdb = await r.connect({
        host: HOST,
        port: PORT,
        db: DB,
        user: USER,
        password: PASSWORD
    });
    event.locals = { rethinkdb };

    let user;
    const SESSIONID = event.cookies.get('SESSIONID');
    if (SESSIONID) user = await get_by_SESSIONID(SESSIONID, rethinkdb);

    if (!user && (event.url.pathname !== '/login' && event.url.pathname !== '/register')) return redirect('/login');
    if (!user) {
        const response = await resolve(event);
        rethinkdb.close();
        return response;
    }

    if (event.url.pathname === '/login' || event.url.pathname === '/register') return redirect('/');
    if ((user.role !== 'admin' && user.left?.role !== 'admin') && event.url.pathname === '/admin') return redirect('/');

    if (!user.left?.game_id && (event.url.pathname === '/encampment' || event.url.pathname === '/map')) return redirect('/');
    if (user.left?.location !== 'Encampment' && event.url.pathname === '/encampment') return redirect('/map');
    else if (user.left?.location === 'Encampment' && event.url.pathname === '/map') return redirect('/encampment');

    if (!user.left) {
        const { password, sessionid, ...rest } = user;
        event.locals.user = rest;
    } else if (user.left) {
        const { password, sessionid, ...rest } = user.left;
        event.locals.user = rest;
        event.locals.game = user.right;
    }

    const response = await resolve(event);
    rethinkdb.close();
    return response;
};
