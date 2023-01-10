<script>
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import Item from '../../game/Item.svelte';
	import InteractiveItem from './InteractiveItem.svelte';

	export let items;
	export let wound;

	const item = {
		attack: 0,
		credit: 'Freepik',
		defense: 0,
		description: 'Se soigner',
		disease: 0,
		hunger: 0,
		icon: 'heal',
		id: 'eb8a1f18-adb1-47c3-8481-f8210966519f',
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
				{#if item.type === 'drug' && (wound === 1 || wound === 2 && item.rarity === 'rare' || item.rarity === 'épique')}
					<InteractiveItem {item} action={'/player?/heal'} />
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
