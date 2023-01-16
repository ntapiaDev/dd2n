<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		credit: 'surang',
		description: 'Passage en force (blessure grave)',
		icon: 'force',
		id: 'cf45ff13-134b-489d-8afb-a06a42054018',
		type: 'misc',
	};
</script>

<form method="POST" action="/map?/force" use:enhance>
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
