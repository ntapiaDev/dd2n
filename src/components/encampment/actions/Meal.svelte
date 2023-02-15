<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	export let ap;
	export let value;

	const item = {
		credit: 'Freepik',
        description: 'Prendre un bon repas',
        icon: 'meal',
        id: 'fc3cb42f-e68e-461a-9fa3-069f8d6bab17',
        type: 'misc'
	};
</script>

<form method="POST" action="/encampment?/meal" use:enhance>
	<button>
		<Item {item} substitute={`Prendre un bon repas (+${value}% et ${ap} PA)`} />
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
