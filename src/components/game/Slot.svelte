<script>
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import InteractiveItem from '../map/actions/InteractiveItem.svelte';
	import Item from './Item.svelte';

	export let name;
	export let slot;
	export let items;

	const icons = {
		W1: {
			attack: 0,
			credit: 'DinosoftLabs',
			defense: 0,
			description: 'Équiper une arme blanche',
			disease: 0,
			hunger: 0,
			icon: 'baton',
			id: 'e15f3c22-08eb-47e2-939f-a620d438efdb',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		W2: {
			attack: 0,
			credit: 'Freepik',
			defense: 0,
			description: 'Équiper une arme à feu',
			disease: 0,
			hunger: 0,
			icon: 'pistol',
			id: 'b0549187-ecc7-4e7c-9c4c-cca8ad2b057d',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		W3: {
			attack: 0,
			credit: 'manshagraphics',
			defense: 0,
			description: 'Équiper des munitions',
			disease: 0,
			hunger: 0,
			icon: 'ammo',
			id: '1c193330-a525-4ed3-b247-ac94472f5be0',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		A1: {
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
		A2: {
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
		A3: {
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
	};

	let open = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="item" on:mouseenter={() => (open = true)} on:mouseleave={() => (open = false)}>
	{#if slot}
		<InteractiveItem item={slot} action={'/items?/unequip'} />
	{:else}
		<Item item={icons[name]} />
	{/if}
	{#if open}
		<div transition:slide={{ duration: 500, easing: quintOut }} on:click={() => (open = false)}>
			{#each items as item}
				{#if item.slot === name}
					<InteractiveItem {item} action={'/items?/equip'} />
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.item {
		width: 25px;
		height: 25px;
	}
</style>
