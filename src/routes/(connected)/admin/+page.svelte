<script>
	import { enhance } from '$app/forms';
	import { items } from '../../../stores/items';
	import Item from '../../../components/game/Item.svelte';
</script>

<h1>Administration du site</h1>

<section>
	<h2>Ajouter des objets :</h2>
	<form method="POST" action="?/item" use:enhance>
		<div class="infos">
			<input type="text" name="icon" placeholder="Icone" required />
			<input type="text" name="description" placeholder="Description" required />
			<select name="type" required>
				<option value="food">Nourriture</option>
				<option value="drink">Boisson</option>
				<option value="drug">Médicament</option>
				<option value="weapon">Arme</option>
				<option value="ammunition">Munition</option>
				<option value="armour">Armure</option>
				<option value="resource">Ressource</option>
				<option value="blueprint">Plan</option>
				<option value="misc">Divers</option>
			</select>
			<select name="rarity">
				<option value="commun">Commun</option>
				<option value="inhabituel">Inhabituel</option>
				<option value="rare">Rare</option>
				<option value="épique">Épique</option>
				<option value="légendaire">Légendaire</option>
			</select>
			<select name="unique">
				<option value="not_unique">Non unique</option>
				<option value="unique">Unique</option>
			</select>
		</div>
		<div class="stats">
			<input type="number" min="1" max="1" name="hunger" placeholder="Faim" />
			<input type="number" min="1" max="1" name="thirst" placeholder="Soif" />
			<input type="number" min="1" max="1" name="disease" placeholder="Maladie" />
			<input type="number" min="1" max="100" name="attack" placeholder="Attaque" />
			<input type="number" min="1" max="100" name="defense" placeholder="Défense" />
			<input type="text" name="credit" placeholder="Auteur" required />
			<button type="submit">Ajouter</button>
		</div>
	</form>
	<h2>Liste des objets ({$items.length}) :</h2>
	<div class="list">
		{#each $items as { id }}
			<Item {id} />
		{/each}
	</div>
</section>

<style>
	h1 {
		margin: 1em 0 0;
		text-align: center;
	}
	section {
		padding: 1em;
	}
	form,
	.list {
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
	.stats input {
		width: 100px;
	}
	.stats button {
		width: 150px;
	}
</style>
