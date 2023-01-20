import r from 'rethinkdb';
import { HOST, PORT, DB, USER, PASSWORD } from '$env/static/private';
import { getBySESSIONID } from './utils/users';

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
    if (SESSIONID) user = await getBySESSIONID(SESSIONID, rethinkdb);

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
    if ((user.left?.role !== 'admin' && user.role !== 'admin') && event.url.pathname === '/admin') {
        return redirect('/');
    }

    // Gestion des pages du jeu
    // Créer une variable in/out
    if (!user.left?.game_id && event.url.pathname === '/map') {
        return redirect('/');
    }
    // if (user.role !== 'admin' && user.location !== 'H8' && (event.url.pathname === '/' || event.url.pathname === '/encampment')) {
    //     return redirect('/map');
    // }

    event.locals.user = {
        id: user.left?.id ?? user.id,
        username: user.left?.username ?? user.username,
        role: user.left?.role ?? user.role,
        game_id: user.left?.game_id ?? '',
        ap: user.left?.ap ?? '',
        location: user.left?.location ?? '',
        hunger: user.left?.hunger ?? '',
        thirst: user.left?.thirst ?? '',
        wound: user.left?.wound ?? '',
        force: user.left?.force ?? '',
        inventory: user.left?.inventory ?? '',
        slots: user.left?.slots ?? '',
        stats: user.left?.stats ?? '',
        tchat: user.left?.tchat ?? '',
        day: user.right?.day ?? '',
        encampment: user.right?.encampment ?? '',
        name: user.right?.name ?? '',
        uniques: user.right?.uniques ?? ''
    }

    const response = await resolve(event);
    rethinkdb.close();
    return response;
};
