<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		credit: 'Freepik',
		description: 'Entrer dans le campement',
		icon: 'encampment',
		id: 'e6e6f493-6bbd-4146-92b3-6aee67de79f6',
		type: 'misc',
	};
</script>

<form>
<!-- <form method="POST" action="/map?/encampment" use:enhance> -->
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
		/* cursor: pointer; */
	}
</style>
