<script>
	import { page } from '$app/stores';
	import Item from './Item.svelte';
	
	export let hunger = $page.data.user.hunger;

	const items = [
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
			description: 'Grosse faim',
			icon: 'hungry',
			id: '23a97671-c68a-4b55-82ed-338a43ec6737',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Affamé',
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
	$: if ($page.url.pathname !== '/players') hunger = $page.data.user.hunger;
	$: index = hunger > 75 ? 0 :
		hunger > 50 ? 1 :
		hunger > 24 ? 2 :
		hunger > 0 ? 3 : 4;

	$: r = hunger > 75 ? 205 : 255;
	$: g = hunger > 75 ? 255 :
		hunger > 25 ? 255 - (75 - hunger) :
		hunger > 0 ? 205 - (25 - hunger) * 2 : 105;
	$: b = hunger > 25 ? 205 :
		hunger > 0 ? 205 - (25 - hunger) * 2 : 105;
	$: background = hunger > 0 ? `rgb(${r}, ${g}, ${b})` : 'rgb(255, 105, 105)';
</script>

<Item item={items[index]} {background} substitute={`${items[index].description} (${hunger}%)`} />
