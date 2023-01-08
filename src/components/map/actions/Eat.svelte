<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		attack: 0,
		credit: 'Freepik',
		defense: 0,
		description: 'Manger',
		disease: 0,
		hunger: 0,
		icon: 'eat',
		id: '17b06314-2f60-453c-98d5-a9ce0049dc51',
		rarity: 'commun',
		thirst: 0,
		type: 'misc',
		unique: false
	};
</script>

<!-- <form method="POST" action="/map?/eat" use:enhance> -->
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
