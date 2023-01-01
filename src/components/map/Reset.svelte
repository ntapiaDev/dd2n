<script>
    import { enhance } from '$app/forms';
    
	export let user_id;
</script>

<form method="POST" action="/map?/reset" use:enhance>
    <input type="text" name="user_id" value={user_id} hidden>
	<button type="submit">Reset</button>
</form>
