import { redirect } from '@sveltejs/kit'

export const actions = {
    default({ cookies }) {
        cookies.delete('SESSIONID');
        throw redirect(302, '/login');
    },
}
