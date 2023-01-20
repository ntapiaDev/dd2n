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

    if (!user && (event.url.pathname !== '/login' && event.url.pathname !== '/register')) {
        return redirect('/login');
    }
    if (!user) {
        const response = await resolve(event);
        rethinkdb.close();
        return response;
    }

    if (event.url.pathname === '/login' || event.url.pathname === '/register') {
        return redirect('/');
    }
    if ((user.role !== 'admin' && user.role !== 'admin') && event.url.pathname === '/admin') {
        return redirect('/');
    }

    // Gestion des pages du jeu
    // Créer une variable in/out
    if (!user.game_id && event.url.pathname === '/map') {
        return redirect('/');
    }
    // if (user.role !== 'admin' && user.location !== 'H8' && (event.url.pathname === '/' || event.url.pathname === '/encampment')) {
    //     return redirect('/map');
    // }

    event.locals.user = {
        id: user.id,
        username: user.username,
        role: user.role,
        game_id: user.game_id ?? '',
        ap: user.ap ?? '',
        location: user.location ?? '',
        hunger: user.hunger ?? '',
        thirst: user.thirst ?? '',
        wound: user.wound ?? '',
        force: user.force ?? '',
        inventory: user.inventory ?? '',
        slots: user.slots ?? '',
        stats: user.stats ?? '',
        tchat: user.tchat ?? '',
        day: user.day ?? '',
        encampment: user.encampment ?? '',
        name: user.name ?? '',
        uniques: user.uniques ?? ''
    }

    const response = await resolve(event);
    rethinkdb.close();
    return response;
};
