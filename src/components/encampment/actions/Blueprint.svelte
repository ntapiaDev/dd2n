<script>
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import InteractiveItem from '../../game/InteractiveItem.svelte';
	import Item from '../../game/Item.svelte';

	export let user;

	const item = {
		credit: 'wanicon',
		description: 'Ajouter un plan',
		icon: 'blueprint',
		id: '944e4b59-b34f-46a7-81e1-997104cc2d04',
		type: 'misc'
	};

	let open = false;
</script>

{#if user?.inventory.some(i => i.type === 'blueprint')}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="item" on:mouseenter={() => (open = true)} on:mouseleave={() => (open = false)}>
		<Item {item} />
		{#if open}
			<div transition:slide={{ duration: 500, easing: quintOut }} on:click={() => (open = false)}>
				{#each user?.inventory as item}
					{#if item.type === 'blueprint'}
						<InteractiveItem {item} action={'/encampment?/blueprint'} />
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
