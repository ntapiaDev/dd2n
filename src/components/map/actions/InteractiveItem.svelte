<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	export let item;
	export let action;
</script>

<form method="POST" {action} use:enhance>
	<input type="text" name="id" value={item.id} hidden>
	<button>
		<Item {item} />
	</button>
</form>

<style>
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
</style>
