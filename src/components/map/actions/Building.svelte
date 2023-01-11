<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		attack: 0,
		credit: 'Freepik',
		defense: 0,
		description: 'Fouiller le bâtiment',
		disease: 0,
		hunger: 0,
		icon: 'building',
		id: 'ade8a391-a49f-40b6-9862-55f61c891e86',
		rarity: 'commun',
		thirst: 0,
		type: 'misc',
		unique: false
	};
</script>

<form method="POST" action="/map?/building" use:enhance>
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
