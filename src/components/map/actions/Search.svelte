<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		attack: 0,
		credit: 'Freepik',
		defense: 0,
		description: 'Fouiller la zone',
		disease: 0,
		hunger: 0,
		icon: 'search',
		id: '2eda30dc-9ad7-4f5c-a76d-e65bcc68cd30',
		rarity: 'commun',
		thirst: 0,
		type: 'misc',
		unique: false
	};
</script>

<form method="POST" action="/map?/search" use:enhance>
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
