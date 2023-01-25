<script>
    import { page } from '$app/stores';
    import { enhance } from '$app/forms';
</script>

<form method="POST" action={`/${$page.data.user.location === 'Encampment' ? 'encampment' : 'map'}?/nextDay`} use:enhance>
	<button type="submit">Next day</button>
</form>

<style>
    button {
        cursor: pointer;
    }
</style>
