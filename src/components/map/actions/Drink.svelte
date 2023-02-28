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
		description: 'Boire',
		icon: 'drink',
		id: 'd0c278e8-c40b-4362-aea9-1e0b239c4ff8',
		type: 'misc',
	};

	$: items = sortItems([...user.bag1, ...user.bag2, ...user.inventory]);

	let open = false;
</script>

{#if user?.thirst <= 75 || (user?.ap < getPAMax($page.data.user.xp) && items.some(i => i.ap && i.type ==='drink'))}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="item" on:mouseenter={() => (open = true)} on:mouseleave={() => (open = false)}>
		<Item {item} />
		{#if open}
			<div transition:slide={{ duration: 500, easing: quintOut }} on:click={() => (open = false)}>
				{#each items as item}
					{#if user?.thirst <= 75 && item.type === 'drink' && !item.ap}
						<InteractiveItem {item} action={'/player?/feed'} />
					{:else if user?.ap < getPAMax($page.data.user.xp) && item.type === 'drink' && item.ap}
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
