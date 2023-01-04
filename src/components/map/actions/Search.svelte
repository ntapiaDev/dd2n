<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';
</script>

<form method="POST" action="/map?/search" use:enhance>
	<button>
		<Item id="2eda30dc-9ad7-4f5c-a76d-e65bcc68cd30" />
	</button>
</form>

<style>
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
</style>
