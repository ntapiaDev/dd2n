<script>
	import { page } from '$app/stores';
	import { tooltip } from './tooltip';

	export let item;

	$: title = item.description +
		(item.attack > 0 ? ` (Puissance : ${item.attack})` : '') +
		(item.defense > 0 ? ` (Protection : ${item.defense})` : '') +
		(item.rarity !== 'commun' ? ` (${item.rarity})` : '') +
		(item.unique ? ' (unique)' : '');

	$: durability =	item.slot !== "W1" ? 1 : item.durability / item.durabilityMax;
	$: x = durability > 0.5 ? 510 - (255 * 2 * durability) : 255;
	$: y = durability > 0.5 ? 202 - (74 * durability) : 330 * durability;
</script>

<!-- ATTENTION : termes en français depuis DB (rarity) utilisés dans le nom des classes et options (à refaire si un jour site en anglais...) -->
<span class="container {item.type} {item.rarity}">
	<!-- Remplacer par BASEURI ou équivalent?? -->
	<img src={$page.url.origin + '/icons/' + item.icon + '.png'}
		alt={item.icon + ' icon by ' + item.credit}
		{title}
		use:tooltip />
	{#if item.unique}
		<img src={$page.url.origin + '/star.png'} alt="Objet unique by Kemalmoe" class="unique" {title} use:tooltip />
	{:else if item.quantity}
		<span class="quantity">
			{item.quantity}
		</span>
	{/if}
	{#if item.slot === "W1"}
		<div class="durability">
			<div class="bar" style={`width: ${durability * 100}%; background-color: rgb(${x}, ${y}, 0)`}></div>
		</div>
	{/if}
</span>

<style>
	.container {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 25px;
		height: 25px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0.25em;
	}
	img {
		width: 20px;
		height: 20px;
	}

	/* Type */
	.food {
		background-color: rgb(205, 255, 205);
	}
	.drink {
		background-color: rgb(205, 255, 255);
	}
	.drug {
		background-color: rgb(255, 255, 205);
	}
	.weapon {
		background-color: rgb(255, 205, 205);
	}
	.ammunition {
		background-color: #EEE;
	}
	.armour {
		background-color: rgb(255, 225, 205);
	}
	.resource {
		background-color: rgb(255, 225, 155);
	}
	.blueprint {
		background-color: rgb(255, 205, 255);
	}
	.misc {
		background-color: #EEE;
	}

	/* Rarity */
	.inhabituel {
		border: 1px solid green;
	}
	.rare {
		border: 1px solid blue;
	}
	.épique {
		border: 1px solid purple;
	}
	.légendaire {
		border: 1px solid orange;
	}

	/* Unique */
	.unique {
		width: 12px;
		height: 12px;
		position: absolute;
		top: 0px;
		right: 0px;
	}

	/* Quantity */
	.quantity {
		position: absolute;
		top: -3px;
		right: 1px;
		text-shadow: 1px 0 0 #EEE, 1px 1px 0 #EEE, 0 1px 0 #EEE, -1px 1px 0 #EEE, -1px 0 0 #EEE, -1px -1px 0 #EEE, 0 -1px 0 #EEE, 1px -1px 0 #EEE;
		opacity: 0.9;
		font-size: 0.9em;
	}

	/* Durability */
	.durability {
		width: 20px;
		height: 3px;
		position: absolute;
		bottom: 2px;
	}
	.bar {
		height: 100%;
	}
</style>
