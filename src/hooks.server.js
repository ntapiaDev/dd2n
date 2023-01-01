import r from 'rethinkdb';
import { HOST, PORT, DB, USER, PASSWORD } from '$env/static/private';
import { getBySESSIONID } from './utils/users';

const redirect = (location) =>
    new Response(null, {
        status: 307,
        headers: { location }
    });

export const handle = async ({ event, resolve }) => {
    // Connexion à la base de données
    const rethinkdb = await r.connect({
        host: HOST,
        port: PORT,
        db: DB,
        user: USER,
        password: PASSWORD
    });
    event.locals = { rethinkdb };

    let user;
    // Récupération de la session
    const SESSIONID = await event.cookies.get('SESSIONID');
    if (SESSIONID) user = await getBySESSIONID(SESSIONID, event.locals.rethinkdb);

    if (!user && (event.url.pathname !== '/login' && event.url.pathname !== '/register')) {
        return redirect('/login');
    }
    if (!user) {
        const response = await resolve(event);
        rethinkdb.close();
        return response;
    }

    if (user && (event.url.pathname === '/login' || event.url.pathname === '/register')) {
        return redirect('/');
    }

    // User dans locals
    if (user) event.locals.user = {
        username: user.username,
        roles: user.roles,
        days: user.days,
        location: user.location,
        ap: user.ap,
        life: user.life,
        hunger: user.hunger,
        thirst: user.thirst,
        disease: user.disease,
        inventory: user.inventory
    }

    const response = await resolve(event);
    rethinkdb.close();
    return response;
};
