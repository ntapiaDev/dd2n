<script>
	import { page } from '$app/stores';
	import Item from './Item.svelte';

	const thirst = [
		{
			attack: 0,
			credit: 'kmg design',
			defense: 0,
			description: 'Hydraté',
			disease: 0,
			hunger: 0,
			icon: 'hydrated',
			id: '0ba7eb83-93e3-4dee-8d70-ae0ca8f86292',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'Good Ware',
			defense: 0,
			description: 'Petite soif',
			disease: 0,
			hunger: 0,
			icon: 'thirsty',
			id: 'b8efc8bc-ba78-408b-932f-bc41c8e927f6',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'Freepik',
			defense: 0,
			description: 'Déshydraté',
			disease: 0,
			hunger: 0,
			icon: 'drop',
			id: '20738a03-9c34-411e-b08b-1ade1cc927a6',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'Freepik',
			defense: 0,
			description: 'Mort de soif',
			disease: 0,
			hunger: 0,
			icon: 'dehydrated',
			id: '9031ee03-0eb8-4f07-9bee-7218840ae2bc',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'Smashicons',
			defense: 0,
			description: 'Décédé',
			disease: 0,
			hunger: 0,
			icon: 'dead',
			id: '1e0e9356-2734-4f7b-b1c6-d8c5cee0e7e8',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		}
	];
	$: index = Math.floor(4 - (4 * $page.data.user.thirst) / 100) < 5 ? Math.floor(4 - (4 * $page.data.user.thirst) / 100) : 4
</script>

<Item item={thirst[index]} />
