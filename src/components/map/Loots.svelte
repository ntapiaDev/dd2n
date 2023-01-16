<script>
	import { createEventDispatcher } from 'svelte';
	import { flip } from 'svelte/animate';
	import { sortItems } from '../../utils/tools';
	import Item from '../game/Item.svelte';

	export let map;

	const human = {
		credit: "Freepik" ,
		description: "Un petit joueur tout innocent" ,
		icon: "human" ,
		id: "68604984-3955-466c-bfd0-af3b2a5710a3" ,
		type: "misc" ,
	};

	const dispatch = createEventDispatcher();

	function showLoots(coordinates) {
		dispatch('showLoots', { coordinates });
	}
	function hideLoots() {
		dispatch('hideLoots', '');
	}
	function showPlayers() {
		dispatch('showPlayers', { players });
	}
	function hidePlayers() {
		dispatch('hidePlayers', '');
	}

	$: loots = [] || map;
	let quantity, zombies;
	$: if (map) quantity = zombies = 0;
	$: for (let row of map.rows) {
		for (let cell of row) {
			zombies += cell.zombies;
			for (let loot of cell.items) {
				quantity += loot.quantity;
				let newLoot = {...loot};
				if (loots.find((i) => i.id === newLoot.id)) {
					loots[loots.indexOf(loots.find((i) => i.id === newLoot.id))].coordinates.push({coordinates: cell.coordinate, quantity: newLoot.quantity});
					loots[loots.indexOf(loots.find((i) => i.id === newLoot.id))].total += newLoot.quantity;
				} else {
					if (newLoot.plus) {
						if (newLoot.type === 'weapon') newLoot.attack -= newLoot.plus;
						else if (newLoot.type === 'armour') newLoot.defense -= newLoot.plus;
						newLoot.plus = 0;
					}
					if (newLoot.durability) newLoot.durability = 0;
					newLoot.coordinates = [{coordinates: cell.coordinate, quantity: newLoot.quantity}];
					newLoot.total = newLoot.quantity;
					loots.push(newLoot);
				}
			}
		}
	}

	$: players = [] || map;
	$: for (let row of map.rows) {
		for (let cell of row) {
			for (let player of cell.players) {
				players.push({
					'username': player,
					'coordinate': cell.coordinate
				})
			}
		}
	}

	const getUsernames = (players) => {
		let usernames = '';
		for (let player of players) usernames += ('<br/>' + player.username + ` (${player.coordinate})`);
		return usernames;
	}
	$: playersMap = `Joueurs sur la carte (${players.length}) :` + getUsernames(players);
</script>

<aside>
	<span class="title">Objets sur la carte ({quantity}) :</span>
	<span on:mouseenter={showPlayers} on:mouseleave={hidePlayers}>
		<Item item={human} quantity={players.length} substitute={playersMap} />
	</span>
	<span class="zombies" style={`background-color: rgb(255, 0, 0, ${zombies / 10000})`}>Total de zombies : {zombies}</span>
	{#each sortItems(loots) as loot (loot.id)}
		<span class="item" on:mouseenter={() => showLoots(loot.coordinates)} on:mouseleave={hideLoots} animate:flip>
			<Item item={loot} quantity={loot.total} />
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
		overflow-y: auto;
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
