<script>
	import { page } from '$app/stores';
	import Item from './Item.svelte';

	const thirst = [
		{
			credit: 'kosonicon',
			description: 'Hydraté',
			icon: 'hydrated',
			id: '0ba7eb83-93e3-4dee-8d70-ae0ca8f86292',
			type: 'misc',
		},
		{
			credit: 'Good Ware',
			description: 'Petite soif',
			icon: 'thirsty',
			id: 'b8efc8bc-ba78-408b-932f-bc41c8e927f6',
			type: 'misc',
		},
		{
			credit: 'Good Ware',
			description: 'Déshydraté',
			icon: 'thirsty',
			id: 'b8efc8bc-ba78-408b-932f-bc41c8e927f6',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Mort de soif',
			icon: 'dehydrated',
			id: '9031ee03-0eb8-4f07-9bee-7218840ae2bc',
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
	$: index = Math.floor(4 - (4 * $page.data.user.thirst) / 100) < 5 ? Math.floor(4 - (4 * $page.data.user.thirst) / 100) : 4

	$: opacity = $page.data.user.thirst > 75 ? (100 - (100 - $page.data.user.thirst) * 4) / 100 : ((75 - $page.data.user.thirst) * 4) / 100;
	$: orange = 255 - ((50 - $page.data.user.thirst) * 2);
	$: red = $page.data.user.thirst < 25 ? 205 - (25 - $page.data.user.thirst) * 2 : 205;
	$: background = $page.data.user.thirst > 75 ? `rgb(205, 255, 205, ${opacity})` :
		$page.data.user.thirst > 50 ? `rgb(255, 255, 205, ${opacity})` :
		$page.data.user.thirst > 0 ? `rgb(255, ${orange}, ${red})` : 'rgb(255, 105, 105)';
</script>

<Item item={thirst[index]} {background} />
