<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	export let id;
	export let action;
</script>

<form method="POST" {action} use:enhance>
	<input type="text" name="id" value={id} hidden>
	<button>
		<Item {id} />
	</button>
</form>

<style>
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
</style>
