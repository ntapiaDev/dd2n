<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		attack: 0,
		credit: 'Freepik',
		defense: 0,
		description: 'Se soigner',
		disease: 0,
		hunger: 0,
		icon: 'heal',
		id: 'eb8a1f18-adb1-47c3-8481-f8210966519f',
		rarity: 'commun',
		thirst: 0,
		type: 'misc',
		unique: false
	};
</script>

<!-- <form method="POST" action="/map?/heal" use:enhance> -->
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
