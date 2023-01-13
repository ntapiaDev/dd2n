<script>
	import { enhance } from '$app/forms';
	import { flip } from 'svelte/animate';
	import { sortItems } from '../../../utils/tools';
	import Item from '../../../components/game/Item.svelte';

	export let data;
	$: items = sortItems(data.items);
	$: console.log(items);

	let type = '';
	let slot = '';

	const types = [
		'Nourriture',
		'Boisson',
		'Médicament',
		'Arme',
		'Munition',
		'Explosif',
		'Armure',
		'Ressource',
		'Plan',
		'Divers'
	];

	let itemsArray = [];

	$: if (items) {
		let type = 'food';
		let i = 0;
		let row = [];
		itemsArray = [];
		for (let item of items) {
			if (item.type === type) row.push(item);
			else {
				itemsArray.push(row);
				type = item.type;
				row = [];
				row.push(item);
				i++;
			}
		}
		itemsArray.push(row);
	}
</script>

<h1>Administration du site</h1>
<section>
	<h2>Ajouter des objets :</h2>
	<form method="POST" action="?/addItem" use:enhance>
		<div class="infos">
			<input type="text" name="icon" placeholder="Icone" required />
			<input type="text" name="description" placeholder="Description" required />
			<select name="type" bind:value={type} required>
				<option value="">Type</option>
				<option value="food">Nourriture</option>
				<option value="drink">Boisson</option>
				<option value="drug">Médicament</option>
				<option value="weapon">Arme</option>
				<option value="ammunition">Munition</option>
				<option value="explosive">Explosif</option>
				<option value="armour">Armure</option>
				<option value="resource">Ressource</option>
				<option value="blueprint">Plan</option>
				<option value="misc">Divers</option>
			</select>
			<select name="rarity" required>
				<option value="">Rareté</option>
				<option value="commun">Commun</option>
				<option value="inhabituel">Inhabituel</option>
				<option value="rare">Rare</option>
				<option value="épique">Épique</option>
				<option value="légendaire">Légendaire</option>
			</select>
			<select name="unique" required>
				<option value="not_unique">Non unique</option>
				<option value="unique">Unique</option>
			</select>
		</div>
		<div class="stats">
			{#if ['weapon', 'ammunition', 'explosive', 'armour'].includes(type)}
				<select name="slot" bind:value={slot} required>
					<option value="">Slot</option>
					{#if type === 'armour'}
						<option value="A1">A1</option>
						<option value="A2">A2</option>
						<option value="A3">A3</option>
					{:else if type === 'weapon'}
						<option value="W1">W1</option>
						<option value="W2">W2</option>
					{:else if type === 'ammunition'}
						<option value="W3">W3</option>
					{:else if type === 'explosive'}
						<option value="W4">W4</option>
					{/if}
				</select>
				{#if type === 'armour'}
					<input type="number" min="1" max="100" name="defense" placeholder="Défense" required />
				{:else if ['weapon', 'explosive'].includes(type)}
					<input type="number" min="1" max="100" name="attack" placeholder="Attaque" required />
					{#if slot === 'W1'}
						<input type="number" min="1" max="100" name="durabilityMax" placeholder="Durabilité" required />
					{/if}
				{/if}
				{#if ['W2', 'W3'].includes(slot)}
					<select name="weapon" required>
						<option value="">Arme</option>
						<option value="gun">Gun</option>
						<option value="rifle">Rifle</option>
						<option value="shotgun">Shotgun</option>
						<option value="machine-gun">Machine gun</option>
					</select>
				{/if}
			{:else if type === 'drug'}
				<select name="wound" class="drug" required>
					<option value="">Blessures</option>
					<option value="égratignures">Égratignures</option>
					<option value="blessures graves">Blessures graves</option>
					<option value="blessures mortelles">Blessures mortelles</option>
				</select>
			{/if}
			<select name="code" class="code">
				<option value="">Bâtiment</option>
				<option value="b1">Épicerie</option>
				<option value="b2">Entrepot de bricolage</option>
				<option value="b3">Pharmacie</option>
				<option value="b4">Magasin de matériel informatique</option>
				<option value="b5">Commissariat de police</option>
			</select>
			<input type="text" name="credit" placeholder="Auteur" required />
			<button type="submit">Ajouter</button>
		</div>
	</form>
	<h2>Liste des objets ({items.length}) :</h2>
	<div class="list">
		{#each itemsArray as row, i}
			<h3>{types[i]} ({row.length}) :</h3>
			{#each row as item (item.id)}
				<span animate:flip>
					<Item {item} />
				</span>
			{/each}
		{/each}
	</div>
</section>

<style>
	h1 {
		margin: 1em 0 0;
		text-align: center;
	}
	h3 {
		margin-top: 0.5em;
	}
	section {
		padding: 1em;
	}
	form {
		margin: 1em 0;
	}
	input,
	select {
		text-align: center;
	}
	.infos {
		margin-bottom: 3px;
	}
	.infos input,
	.infos select {
		width: 100px;
	}
	.infos input:nth-child(2) {
		width: 307px;
	}
	.infos select:nth-child(5) {
		width: 150px;
	}
	.stats input,
	.stats select,
	.stats button {
		width: 100px;
	}
	select.drug {
		width: 203px;
	}
	select.code {
		width: 307px;
	}
	span {
		display: inline-block;
	}
</style>
