<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		credit: 'Freepik',
		description: 'Fouiller le bâtiment',
		icon: 'building',
		id: 'ade8a391-a49f-40b6-9862-55f61c891e86',
		type: 'misc',
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
