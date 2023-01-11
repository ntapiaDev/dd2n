<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		attack: 0,
		credit: 'Freepik',
		defense: 0,
		description: 'Entrer dans le campement',
		disease: 0,
		hunger: 0,
		icon: 'encampment',
		id: 'e6e6f493-6bbd-4146-92b3-6aee67de79f6',
		rarity: 'commun',
		thirst: 0,
		type: 'misc',
		unique: false
	};
</script>

<form method="POST" action="/map?/encampment" use:enhance>
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
