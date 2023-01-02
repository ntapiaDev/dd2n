<script>
    import { enhance } from '$app/forms';

    export let power;    
</script>

<form method="POST" action="/map?/nextday" use:enhance>
    <input type="text" name="power" value={power} hidden>
	<button type="submit">Next day x {power}</button>
</form>

<style>
    form {
        display: inline-block;
    }
</style>
