<script>
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import Item from '../../game/Item.svelte';
	import InteractiveItem from './InteractiveItem.svelte';

	export let items;

	const item = {
		attack: 0,
		credit: 'Freepik',
		defense: 0,
		description: 'Boire',
		disease: 0,
		hunger: 0,
		icon: 'drink',
		id: 'd0c278e8-c40b-4362-aea9-1e0b239c4ff8',
		rarity: 'commun',
		thirst: 0,
		type: 'misc',
		unique: false
	};

	let open = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="item" on:mouseenter={() => (open = true)} on:mouseleave={() => (open = false)}>
	<Item {item} />
	{#if open}
		<div transition:slide={{ duration: 500, easing: quintOut }} on:click={() => (open = false)}>
			{#each items as item}
				{#if item.type === 'drink'}
					<InteractiveItem {item} action={'/player?/feed'} />
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.item {
		width: 25px;
		height: 25px;
		z-index: 10;
	}
</style>
