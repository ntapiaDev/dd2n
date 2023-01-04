import { generateMap, getMap, getNextDay } from "../../../utils/maps";

export async function load({ locals }) {
    const map = await getMap(locals.user.id, locals.rethinkdb);
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

const search = async ({ locals }) => {
    // TODO : Gestion de la rareté de la case
    // const location = locals.user.location;
    const items = locals.items.filter(i => i.type !== 'misc');
    const foundItem = items[Math.floor(Math.random() * items.length)]
    console.log(foundItem);
}

export const actions = { nextday, reset, search };
