<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	export let distance;

	const item = {
		credit: 'Freepik',
		description: 'Retourner au campement',
		icon: 'exit',
		id: '683c0989-6dbf-44ef-ab9c-1335db3421c6',
		type: 'misc',
	};

	$: substitute = `Distance du campement : ${distance}PA`
</script>

<form>
<!-- <form method="POST" action="/map?/exit" use:enhance> -->
	<button>
		<Item {item} {substitute} />
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
