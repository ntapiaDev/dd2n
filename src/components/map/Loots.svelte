<script>
	import { sortItems } from '../../utils/tools';
	import Item from '../game/Item.svelte';

	export let map;

	const statistics = {
		credit: 'Freepik',
		description: 'Statistiques de la carte',
		icon: 'statistics',
		id: 'ab4778ef-f84d-4e82-a43e-c97ede72c7c3',
		rarity: 'commun',
		type: 'misc',
		unique: false
	};

	$: loots = [] || map;
	let quantity, zombies;
	$: if (map) quantity = zombies = 0;
	$: for (let row of map.rows) {
		for (let cell of row) {
			zombies += cell.zombies;
			for (let loot of cell.items) {
				quantity ++;
				if (loots.find((i) => i.id === loot.id)) {
					loots[loots.indexOf(loots.find((i) => i.id === loot.id))].coordinate.push(
						cell.coordinate
					);
				} else {
					loot.coordinate = [cell.coordinate];
					loots.push(loot);
				}
			}
		}
	}
</script>

<aside>
	<span class="title">Objets sur la carte ({quantity}) :</span>
	<Item item={statistics} />
	<span class="zombies" style={`background-color: rgb(255, 0, 0, ${zombies / 10000})`}>Total de zombies : {zombies}</span>
	{#each sortItems(loots) as loot}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<span class="item" on:click={() => console.log(loot.coordinate)}>
			<Item item={loot} quantity={loot.coordinate.length} />
		</span>
	{/each}
</aside>

<style>
	aside {
		margin-top: 0.5em;
		padding: 0.5em;
		border: 1px solid #aaa;
		display: grid;
		grid-template-columns: repeat(17, 1fr);
		gap: 1px 0;
	}
	.title,
	.zombies {
		height: 25px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0.25em;
	}
	.title {
		grid-column: 1 / 9;
		background-color: #eee;
	}
	.zombies {
		grid-column: 10 / 18;
	}
	.item {
		width: 25px;
		height: 25px;
	}
</style>
