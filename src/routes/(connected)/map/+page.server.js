import { generateMap, getMap, getNextDay } from "../../../utils/maps";

export async function load({ locals }) {
    const map = await getMap(locals.user.id, locals.rethinkdb);
    // Récupérer days depuis getMap?
    map.days = locals.user.days;
    return { map };
}

const nextday = async ({ locals, request }) => {
    const data = await request.formData();
    const power = parseFloat(data.get('power'));
    await getNextDay(locals.user.days, power, locals.user.id, locals.rethinkdb);
}

const reset = async ({ locals }) => {
    await generateMap(locals.user.id, locals.rethinkdb);
}

export const actions = { nextday, reset };
