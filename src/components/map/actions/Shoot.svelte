<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	export let item;
</script>

<!-- <form method="POST" action="/map?/attack" use:enhance> -->
<button>
	<Item {item} />
</button>

<!-- </form> -->
<style>
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
</style>
