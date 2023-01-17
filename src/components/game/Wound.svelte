<script>
	import { page } from '$app/stores';
	import Item from './Item.svelte';

	const items = [
		{
			credit: 'Freepik',
			description: 'Indemne',
			icon: 'healthy',
			id: '62372da1-0ac8-4bc0-a0a6-24ebcd928930',
			type: 'misc',
		},
		{
			credit: 'surang',
			description: 'Quelques égratignures',
			icon: 'scratch',
			id: '09453469-913a-401b-93df-e299a78bc300',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: 'Gravement blessé',
			icon: 'injured',
			id: '0c69e019-aaf0-48b3-ad20-ea38d9389d6f',
			type: 'misc',
		},
		{
			credit: 'Freepik',
			description: "À l'agonie",
			icon: 'dying',
			id: '542a9d5d-36c8-42d5-b8c3-6910d7f3db00',
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

	$: background = $page.data.user.wound === 0 ? 'rgb(205, 255, 205)' :
		$page.data.user.wound === 1 ? 'rgb(255, 255, 205)' :
		$page.data.user.wound === 2 ? 'rgb(255, 230, 205)' :
		$page.data.user.wound === 3 ? 'rgb(255, 205, 205)' : 'rgb(255, 105, 105)';
</script>

<Item item={items[$page.data.user.wound]} {background} />
