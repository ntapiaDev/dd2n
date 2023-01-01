import { generateMap, getMap, getNextDay } from "../../../utils/map";

export async function load({ locals }) {
    const map = await getMap(locals.user.id, locals.rethinkdb);
    map.days = locals.user.days;
    return map;
}

const nextday = async ({ locals, request }) => {
    const data = await request.formData();
    const days = parseFloat(data.get('days'));
    const power = parseFloat(data.get('power'));
    const user_id = data.get('user_id');
    await getNextDay(days, power, user_id, locals.rethinkdb);  
}

const reset = async ({ locals, request }) => {
    const data = await request.formData();
    const user_id = data.get('user_id');
    await generateMap(user_id, locals.rethinkdb);  
}

export const actions = { nextday, reset };
