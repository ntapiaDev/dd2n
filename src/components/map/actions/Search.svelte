<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		credit: 'Freepik',
		description: 'Fouiller la zone',
		icon: 'search',
		id: '2eda30dc-9ad7-4f5c-a76d-e65bcc68cd30',
		type: 'misc',
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
