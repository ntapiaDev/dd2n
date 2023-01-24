<script>
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import InteractiveItem from '../../game/InteractiveItem.svelte';
	import Item from '../../game/Item.svelte';

	export let items;
	export let wound;

	const item = {
		credit: 'Freepik',
		description: 'Se soigner',
		icon: 'heal',
		id: 'eb8a1f18-adb1-47c3-8481-f8210966519f',
		type: 'misc',
	};

	let open = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="item" on:mouseenter={() => (open = true)} on:mouseleave={() => (open = false)}>
	<Item {item} />
	{#if open}
		<div transition:slide={{ duration: 500, easing: quintOut }} on:click={() => (open = false)}>
			{#each items as item}
				{#if item.type === 'drug' && (wound === 1 || wound === 2 && item.rarity === 'rare' || item.rarity === 'épique') && !item.ap}
					<InteractiveItem {item} action={'/player?/heal'} />
				{:else if $page.data.user.ap < 100 && item.type === 'drug' && item.ap}
					<InteractiveItem {item} action={'/player?/boost'} />
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
