export const load = ({ locals }) => {
    // Met le user dans le store $page
    return {
        items: locals.items,
        user: locals.user,
    }
}
