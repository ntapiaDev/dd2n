<script>
	import { page } from '$app/stores';
	import Item from './Item.svelte';

	const hunger = [
		{
			credit: 'Freepik',
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
			icon: 'hungry',
			id: '23a97671-c68a-4b55-82ed-338a43ec6737',
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
			credit: 'Freepik',
			description: 'Décédé',
			icon: 'dead',
			id: '1e0e9356-2734-4f7b-b1c6-d8c5cee0e7e8',
			type: 'misc',
		}
	];
	$: index = Math.floor(4 - (4 * $page.data.user.hunger) / 100) < 5 ? Math.floor(4 - (4 * $page.data.user.hunger) / 100) : 4

	$: opacity = $page.data.user.hunger > 75 ? (100 - (100 - $page.data.user.hunger) * 4) / 100 : ((75 - $page.data.user.hunger) * 4) / 100;
	$: orange = 255 - ((50 - $page.data.user.hunger) * 2);
	$: red = $page.data.user.hunger < 25 ? 205 - (25 - $page.data.user.hunger) * 2 : 205;
	$: background = $page.data.user.hunger > 75 ? `rgb(205, 255, 205, ${opacity})` :
		$page.data.user.hunger > 50 ? `rgb(255, 255, 205, ${opacity})` :
		$page.data.user.hunger > 0 ? `rgb(255, ${orange}, ${red})` : 'rgb(255, 105, 105)';
</script>

<Item item={hunger[index]} {background} />
