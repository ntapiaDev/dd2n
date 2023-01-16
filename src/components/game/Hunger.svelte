<script>
	import { page } from '$app/stores';
	import Item from './Item.svelte';

	const hunger = [
		{
			credit: 'manshagraphics',
			description: 'Rassasié',
			icon: 'satiated',
			id: '7265569b-e8aa-427f-a325-65c2ebc5bc59',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Petite faim',
			icon: 'hungry',
			id: '23a97671-c68a-4b55-82ed-338a43ec6737',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Affamé',
			icon: 'meal',
			id: '068033a5-e1c8-42d9-a16d-415ca7f8c5f6',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Mort de faim',
			icon: 'hunger',
			id: '781741f2-56d8-4fba-8cb7-a79ea1ab1ca7',
			type: 'misc',
		},
		{
			credit: 'Smashicons',
			description: 'Décédé',
			icon: 'dead',
			id: '1e0e9356-2734-4f7b-b1c6-d8c5cee0e7e8',
			type: 'misc',
		}
	];
	$: index = Math.floor(4 - (4 * $page.data.user.hunger) / 100) < 5 ? Math.floor(4 - (4 * $page.data.user.hunger) / 100) : 4
</script>

<Item item={hunger[index]} />
