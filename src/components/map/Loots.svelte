<script>
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { flip } from 'svelte/animate';
	import { sortItems } from '$lib/loots';
	import Item from '../game/Item.svelte';

	export let rows;

	const item = {
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

	$: loots = [] || rows;
	let quantity, zombies;
	$: if (rows) quantity = zombies = 0;
	$: for (let row of rows) {
		for (let cell of row) {
			zombies += cell.zombies;
			if (cell.visible) {
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
	}

	$: players = [] || rows;
	$: for (let row of rows) {
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
		for (let player of players) {
			const color = ($page.data.game.players.find(p => p.username === player.username)).color;
			usernames += (`<br/><span style="color: #FFF; text-shadow: 1px 0 0 ${color}, 1px 1px 0 ${color}, 0 1px 0 ${color}, -1px 1px 0 ${color}, -1px 0 0 ${color}, -1px -1px 0 ${color}, 0 -1px 0 ${color}, 1px -1px 0 ${color}">${player.username} (${player.coordinate})</span>`);
		}
		return usernames;
	}
	$: substitute = `Joueurs sur la carte (${players.length}) :` + getUsernames(players);
</script>

<aside>
	<span class="title">Objets sur la carte ({quantity}) :</span>
	<span on:mouseenter={showPlayers} on:mouseleave={hidePlayers}>
		<Item item={item} quantity={players.length} {substitute} />
	</span>
	<span class="zombies" style={`background-color: rgb(255, 0, 0, ${zombies / 16000})`}>Total de zombies : {zombies}</span>
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
		overflow-x: hidden;
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
