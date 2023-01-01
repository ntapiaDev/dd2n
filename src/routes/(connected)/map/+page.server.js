import { getMap } from "../../../utils/map";

export async function load({ locals }) {
    const map = await getMap(locals.user.id, locals.rethinkdb);
    map.days = locals.user.days;
    return map;
}
