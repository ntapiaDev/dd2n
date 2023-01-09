<script>
	import { page } from '$app/stores';
	import Item from './Item.svelte';

	const wound = [
		{
			attack: 0,
			credit: 'Freepik',
			defense: 0,
			description: 'Indemne',
			disease: 0,
			hunger: 0,
			icon: 'healthy',
			id: '62372da1-0ac8-4bc0-a0a6-24ebcd928930',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'surang',
			defense: 0,
			description: 'Quelques égratignures',
			disease: 0,
			hunger: 0,
			icon: 'scratch',
			id: '09453469-913a-401b-93df-e299a78bc300',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'Freepik',
			defense: 0,
			description: 'Gravement blessé',
			disease: 0,
			hunger: 0,
			icon: 'injured',
			id: '0c69e019-aaf0-48b3-ad20-ea38d9389d6f',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		},
		{
			attack: 0,
			credit: 'Freepik',
			defense: 0,
			description: 'À l\'agonie',
			disease: 0,
			hunger: 0,
			icon: 'dying',
			id: '542a9d5d-36c8-42d5-b8c3-6910d7f3db00',
			rarity: 'commun',
			thirst: 0,
			type: 'misc',
			unique: false
		}
	];
</script>

<Item item={wound[$page.data.user.wound]} />
