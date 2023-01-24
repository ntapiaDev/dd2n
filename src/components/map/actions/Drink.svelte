<script>
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import InteractiveItem from '../../game/InteractiveItem.svelte';
	import Item from '../../game/Item.svelte';

	export let items;

	const item = {
		credit: 'Freepik',
		description: 'Boire',
		icon: 'drink',
		id: 'd0c278e8-c40b-4362-aea9-1e0b239c4ff8',
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
				{#if $page.data.user.thirst <= 75 && item.type === 'drink' && !item.ap}
					<InteractiveItem {item} action={'/player?/feed'} />
				{:else if $page.data.user.ap < 100 && item.type === 'drink' && item.ap}
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
