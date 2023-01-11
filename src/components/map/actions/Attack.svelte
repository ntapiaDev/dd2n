<script>
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	export let item = '';
    $: if (!item) item = {
		attack: 1,
		credit: 'Freepik',
		defense: 0,
		description: 'Se battre à mains nues',
		disease: 0,
		hunger: 0,
		icon: 'attack',
		id: 'd1a3d28e-bd5f-486a-b4fb-7d36254f4344',
		rarity: 'commun',
		slot: 'W0',
		thirst: 0,
		type: 'misc',
		unique: false
	};
</script>

<form method="POST" action="/map?/attack" use:enhance>
	<input type="text" name="id" value={item.id} hidden>
	<button>
		<Item {item} quantity={item.slot === 'W2' ? $page.data.user.slots.W3.quantity : 0}/>
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
