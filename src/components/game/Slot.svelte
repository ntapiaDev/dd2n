<script>
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import InteractiveItem from '../map/actions/InteractiveItem.svelte';
	import Item from './Item.svelte';

	export let items;
	export let name;
	export let slot;

	const icons = {
		W1: {
			credit: 'DinosoftLabs',
			description: 'Équiper une arme blanche',
			icon: 'baton',
			id: 'e15f3c22-08eb-47e2-939f-a620d438efdb',
			type: 'misc',
		},
		W2: {
			credit: 'Freepik',
			description: 'Équiper une arme à feu',
			icon: 'pistol',
			id: 'b0549187-ecc7-4e7c-9c4c-cca8ad2b057d',
			type: 'misc',
		},
		W3: {
			credit: 'manshagraphics',
			description: 'Équiper des munitions',
			icon: 'ammo',
			id: '1c193330-a525-4ed3-b247-ac94472f5be0',
			type: 'misc',
		},
		W4: {
			credit: 'Smashicons',
			description: "Équiper de l'explosif",
			icon: 'explosive',
			id: '9e067be7-c438-40c3-9974-5d92582bb8c1',
			type: 'misc',
		},
		A1: {
			credit: 'iconixar',
			description: 'Équiper un casque',
			icon: 'helmet',
			id: 'f4dfe943-c662-49bf-83c5-090203e30a08',
			type: 'misc',
		},
		A2: {
			credit: 'Freepik',
			description: 'Équiper un torse',
			icon: 'armour',
			id: 'c9e9a022-1088-499a-9354-5e7f012f1517',
			type: 'misc',
		},
		A3: {
			credit: 'Good Ware',
			description: 'Équiper un pantalon',
			icon: 'pants',
			id: '9a707225-a87a-4910-a919-3336ad4d94da',
			type: 'misc',
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
