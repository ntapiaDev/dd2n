<script>
    import { enhance } from '$app/forms';
</script>

<form method="POST" action="/map?/nextDay" use:enhance>
	<button type="submit">Next day</button>
</form>

<style>
    button {
        cursor: pointer;
    }
</style>
