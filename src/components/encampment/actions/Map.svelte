<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		credit: 'Eucalyp',
		description: 'Sortir du campement',
		icon: 'map',
		id: 'aa8dfd8d-383a-4c8d-aa71-2a5e31a419f4',
		type: 'misc'
	};
</script>

<form method="POST" action="/encampment?/map" use:enhance>
	<button>
		<Item {item} />
	</button>
</form>

<style>
	form {
		width: 25px;
		height: 25px;
	}
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
</style>
