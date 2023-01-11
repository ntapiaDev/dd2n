<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

	const item = {
		attack: 0,
		credit: 'surang',
		defense: 0,
		description: 'Passage en force (blessure grave)',
		icon: 'force',
		id: 'cf45ff13-134b-489d-8afb-a06a42054018',
		rarity: 'commun',
		type: 'misc',
		unique: false
	};
</script>

<form method="POST" action="/map?/force" use:enhance>
	<button>
		<Item {item} />
	</button>
</form>

<style>
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
</style>
