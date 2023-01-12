import { fail, redirect } from '@sveltejs/kit';
import { generateMap } from '../../../utils/maps';
import { addUser, getByUsername, setSession } from '../../../utils/users';

// 3 à 16 caractères
const USER_REGEX = /^[A-Za-z][A-Za-z0-9_]{2,15}$/;
// Minimum 8 caractères, 1 lettre min + maj, 1 chiffre et 1 caractère spécial
const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const register = async ({ cookies, locals, request }) => {
    const data = await request.formData();
    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) return fail(400, { invalid: true });

    const user = await getByUsername(username, locals.rethinkdb);
    if (user) return fail(400, { user: true });

    if (!USER_REGEX.test(username)) return fail(400, { username: true });
    if (!PASSWORD_REGEX.test(password)) return fail(400, { password: true });

    const { user_id, SESSIONID } = await addUser({ username, password }, locals.rethinkdb)

    // Création de la carte du joueur
    await generateMap(user_id, username, locals.rethinkdb);

    // Connexion automatique?
    setSession(cookies, SESSIONID);
    throw redirect(303, '/')

    // Sinon message de succès (flash?) et redirect login
    // throw redirect(303, '/login')
}

export const actions = { register };
