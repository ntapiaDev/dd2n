import r from 'rethinkdb';
import { HOST, PORT, DB, USER, PASSWORD } from '$env/static/private';
import { getItems } from './utils/items';
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
    // Récupération de la session et sécurisation des routes
    const SESSIONID = await event.cookies.get('SESSIONID');
    if (SESSIONID) user = await getBySESSIONID(SESSIONID, rethinkdb);

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
    if (user.role !== 'admin' && event.url.pathname === '/admin') {
        return redirect('/');
    }

    // User dans locals
    if (user) event.locals.user = {
        id: user.id,
        username: user.username,
        role: user.role,
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
