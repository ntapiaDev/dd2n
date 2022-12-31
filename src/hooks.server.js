import r from 'rethinkdb';
import { HOST, PORT, DB, USER, PASSWORD } from '$env/static/private';

export const handle = async ({ event, resolve }) => {
    const rethinkdb = await r.connect({
        host: HOST,
        port: PORT,
        db: DB,
        user: USER,
        password: PASSWORD
    });

    event.locals = { rethinkdb };

    const response = await resolve(event);
    rethinkdb.close();
    return response;
};
