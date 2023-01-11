<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		attack: 0,
		credit: 'Freepik',
		defense: 0,
		description: 'Prendre le passage souterrain',
		icon: 'tunnel',
		id: '10766425-d03d-47a0-a1b4-8c489ca318f5',
		rarity: 'commun',
		type: 'misc',
		unique: false
	};
</script>

<form method="POST" action="/map?/tunnel" use:enhance>
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
