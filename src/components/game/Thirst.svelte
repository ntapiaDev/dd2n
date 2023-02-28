<script>
	import { page } from '$app/stores';
	import Item from './Item.svelte';

	export let thirst = $page.data.user.thirst;

	const items = [
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
			description: 'Grosse soif',
			icon: 'thirsty',
			id: 'b8efc8bc-ba78-408b-932f-bc41c8e927f6',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Déshydraté',
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
	$: if ($page.url.pathname !== '/players') thirst = $page.data.user.thirst;
	$: index = thirst > 75 ? 0 :
		thirst > 50 ? 1 :
		thirst > 24 ? 2 :
		thirst > 0 ? 3 : 4;

	$: r = thirst > 75 ? 205 : 255;
	$: g = thirst > 75 ? 255 :
		thirst > 25 ? 255 - (75 - thirst) :
		thirst > 0 ? 205 - (25 - thirst) * 2 : 105;
	$: b = thirst > 25 ? 205 :
		thirst > 0 ? 205 - (25 - thirst) * 2 : 105;
	$: background = thirst > 0 ? `rgb(${r}, ${g}, ${b})` : 'rgb(255, 105, 105)';
</script>

<Item item={items[index]} {background} substitute={`${items[index].description} (${thirst}%)`} />
