<script>
	import { page } from '$app/stores';
	import Item from './Item.svelte';

	const thirst = [
		{
			credit: 'kmg design',
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
			credit: 'Freepik',
			description: 'Déshydraté',
			icon: 'drop',
			id: '20738a03-9c34-411e-b08b-1ade1cc927a6',
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
			credit: 'Smashicons',
			description: 'Décédé',
			icon: 'dead',
			id: '1e0e9356-2734-4f7b-b1c6-d8c5cee0e7e8',
			type: 'misc',
		}
	];
	$: index = Math.floor(4 - (4 * $page.data.user.thirst) / 100) < 5 ? Math.floor(4 - (4 * $page.data.user.thirst) / 100) : 4
</script>

<Item item={thirst[index]} />
