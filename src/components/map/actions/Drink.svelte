<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		attack: 0,
		credit: 'Freepik',
		defense: 0,
		description: 'Boire',
		disease: 0,
		hunger: 0,
		icon: 'drink',
		id: 'd0c278e8-c40b-4362-aea9-1e0b239c4ff8',
		rarity: 'commun',
		thirst: 0,
		type: 'misc',
		unique: false
	};
</script>

<!-- <form method="POST" action="/map?/drink" use:enhance> -->
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
