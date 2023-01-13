<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	export let item;
	export let action;
</script>

<form method="POST" {action} use:enhance>
	<input type="text" name="uuid" value={item.uuid} hidden>
	<button>
		<Item {item} />
	</button>
</form>

<style>
	form,
	button {
		width: 25px;
		height: 25px;
	}
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
</style>
