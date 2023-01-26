<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		credit: 'Freepik',
		description: "Toucher l'autel sacrificiel",
		icon: 'altar',
		id: '81c82050-de02-46da-a220-f558699a26f3',
		type: 'misc'
	};
</script>

<form method="POST" action="/map?/altar" use:enhance>
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
