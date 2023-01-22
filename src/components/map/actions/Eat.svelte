<script>
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import InteractiveItem from '../../game/InteractiveItem.svelte';
	import Item from '../../game/Item.svelte';

	export let items;

	const item = {
		credit: 'Freepik',
		description: 'Manger',
		icon: 'eat',
		id: '17b06314-2f60-453c-98d5-a9ce0049dc51',
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
				{#if item.type === 'food'}
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
