<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		credit: 'Freepik',
		description: 'Prendre le passage souterrain',
		icon: 'tunnel',
		id: '10766425-d03d-47a0-a1b4-8c489ca318f5',
		type: 'misc',
	};
</script>

<form method="POST" action="/map?/tunnel" use:enhance>
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
