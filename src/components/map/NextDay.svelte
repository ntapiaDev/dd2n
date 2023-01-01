<script>
    import { enhance } from '$app/forms';

    export let power;    
	export let user_id;
</script>

<form method="POST" action="/map?/nextday" use:enhance>
    <input type="text" name="power" value={power} hidden>
    <input type="text" name="user_id" value={user_id} hidden>
	<button type="submit">Next day x {power}</button>
</form>

<style>
    form {
        display: inline-block;
    }
</style>
