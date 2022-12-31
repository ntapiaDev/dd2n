import r from 'rethinkdb';

export async function load({ locals }) {
    const { rethinkdb } = locals;

    let users;
    await r.table('users').run(rethinkdb, function (err, cursor) {
        if (err) throw err;
        cursor.toArray(function (err, result) {
            if (err) throw err;
            users = JSON.stringify(result, null, 2);
        });
    });

    return { users }
}