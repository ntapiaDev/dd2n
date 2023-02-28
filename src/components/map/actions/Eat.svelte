<script>
	import { page } from '$app/stores';
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { sortItems } from '$lib/loots';
	import { getPAMax } from "$lib/player";
	import InteractiveItem from '../../game/InteractiveItem.svelte';
	import Item from '../../game/Item.svelte';

	export let user;

	const item = {
		credit: 'Freepik',
		description: 'Manger',
		icon: 'eat',
		id: '17b06314-2f60-453c-98d5-a9ce0049dc51',
		type: 'misc',
	};

	$: items = sortItems([...user.bag1, ...user.bag2, ...user.inventory]);

	let open = false;
</script>

{#if user?.hunger <= 75 || (user?.ap < getPAMax($page.data.user.xp) && items.some(i => i.ap && i.type ==='food'))}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="item" on:mouseenter={() => (open = true)} on:mouseleave={() => (open = false)}>
		<Item {item} />
		{#if open}
			<div transition:slide={{ duration: 500, easing: quintOut }} on:click={() => (open = false)}>
				{#each items as item}
					{#if user?.hunger <= 75 && item.type === 'food' && !item.ap}
						<InteractiveItem {item} action={'/player?/feed'} />
					{:else if user?.ap < getPAMax($page.data.user.xp) && item.type === 'food' && item.ap}
						<InteractiveItem {item} action={'/player?/boost'} />
					{/if}
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.item {
		width: 25px;
		height: 25px;
		z-index: 10;
	}
</style>
