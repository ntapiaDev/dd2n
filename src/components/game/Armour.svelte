<script>
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import InteractiveItem from '../map/actions/InteractiveItem.svelte';
	import Item from './Item.svelte';

	export let items;
	export let slots;

	const icons = [
		{
			attack: 0,
			credit: 'iconixar',
			defense: 0,
			description: 'Équiper un casque',
			disease: 0,
			hunger: 0,
			icon: 'helmet',
			id: 'f4dfe943-c662-49bf-83c5-090203e30a08',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'Freepik',
			defense: 0,
			description: 'Équiper un torse',
			disease: 0,
			hunger: 0,
			icon: 'armour',
			id: 'c9e9a022-1088-499a-9354-5e7f012f1517',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'Good Ware',
			defense: 0,
			description: 'Équiper un pantalon',
			disease: 0,
			hunger: 0,
			icon: 'pants',
			id: '9a707225-a87a-4910-a919-3336ad4d94da',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		}
	];

	let a1 = false;
	let a2 = false;
	let a3 = false;
</script>

<span class="armour">
	<span class="title">Protection :</span>
	<!-- Factoriser??? -->
	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<div class="item" on:mouseenter={() => (a1 = true)} on:mouseleave={() => (a1 = false)}>
		{#if slots.A1}
			<Item item={slots.A1} />
		{:else}
			<Item item={icons[0]} />
		{/if}
        {#if a1}
            <div transition:slide={{ duration: 500, easing: quintOut }}>
                {#each items as item}
                    {#if item.slot === 'A1'}
                        <InteractiveItem {item} action={'/items?/equip'} />
                    {/if}
                {/each}
            </div>
        {/if}
	</div>
	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<div class="item" on:mouseenter={() => (a2 = true)} on:mouseleave={() => (a2 = true)}>
        {#if slots.A2}
			<Item item={slots.A2} />
		{:else}
			<Item item={icons[1]} />
		{/if}
        {#if a2}
            <div transition:slide={{ duration: 500, easing: quintOut }}>
                {#each items as item}
                    {#if item.slot === 'A2'}
                        <InteractiveItem {item} action={'/items?/equip'} />
                    {/if}
                {/each}
            </div>
        {/if}
	</div>
	<!-- svelte-ignore a11y-mouse-events-have-key-events -->
	<div class="item" on:mouseenter={() => (a3 = true)} on:mouseleave={() => (a3 = false)}>
        {#if slots.A3}
			<Item item={slots.A3} />
		{:else}
			<Item item={icons[2]} />
		{/if}
        {#if a3}
            <div transition:slide={{ duration: 500, easing: quintOut }}>
                {#each items as item}
                    {#if item.slot === 'A3'}
                        <InteractiveItem {item} action={'/items?/equip'} />
                    {/if}
                {/each}
            </div>
        {/if}
	</div>
	<span class="total">{(slots.A1.defense ?? 0) + (slots.A2.defense ?? 0) + (slots.A3.defense ?? 0)} DEF</span>
</span>

<style>
	.armour {
		display: inline-flex;
	}
	.title {
		display: flex;
		align-items: center;
		margin: 0 4px;
	}
	.item {
		width: 25px;
        height: 25px;
	}
	.total {
		display: flex;
		align-items: center;
		margin-left: 4px;
	}
</style>
