<script>
	import { page } from '$app/stores';
	import { tooltip } from './tooltip';

	export let background = undefined;
	export let border = undefined;
	export let item;
	export let quantity = 0;
	export let substitute = undefined;

	$: plusColor =
		item.plus === 1 ? 'green' :
		item.plus === 2 ? 'blue' :
		item.plus === 3 ? 'purple' :
		item.plus === 4 ? 'orange' : 'black';

	$: title = substitute ?? (item.description +
		(item.plus > 0 ? ` <span style="color:${plusColor}">+${item.plus}</span>` : '') +
		(item.capacity > 0 ? ` (<span style="color:${plusColor}">${item.capacity}</span> places)` : '') +
		(item.attack > 0 ? ` (Puissance : <span style="color:${plusColor}">${item.attack}</span>)` : '') +
		(item.defense > 0 ? ` (Protection : <span style="color:${plusColor}">${item.defense}</span>)` : '') +
		(item.value ? ` (+${item.value}% et ${item.value / 10} PA)` : '') +
		(item.wound ? ` (${item.wound})` : '') +
		(item.ap ? ` (+${item.ap} PA)` : '') +
		(item.rarity && item.rarity !== 'commun' ? ` (${item.rarity})` : '') +
		(item.unique ? ' (unique)' : ''));

	$: durability =	!item.durability ? 1 : item.durability / item.durabilityMax;
	$: x = durability > 0.5 ? 510 - (255 * 2 * durability) : 255;
	$: y = durability > 0.5 ? 202 - (74 * durability) : 330 * durability;
</script>

<span class="container {item.type} {item.rarity ?? 'commun'}" style={background ? `background-color: ${background}` : border ? `border: 1px solid ${border}` : ''}>
	<!-- Remplacer par BASEURI ou équivalent?? -->
	<img src={$page.url.origin + '/icons/' + item.icon + '.png'}
		alt={item.icon + ' icon by ' + item.credit}
		{title}
		use:tooltip />
	{#if item.unique}
		<img src={$page.url.origin + '/star.png'} alt="Objet unique by Kemalmoe" class="unique" {title} use:tooltip />
	{:else if quantity > 1 || item.quantity > 1 && quantity !== 'none' || (item.icon === 'human' && quantity > 0)}
		<span class="quantity" {title} use:tooltip>
			{quantity || item.quantity}
		</span>
	{/if}
	{#if item.durability}
		<div class="durability">
			<div class="bar" style={`width: ${durability * 100}%; background-color: rgb(${x}, ${y}, 0)`} {title} use:tooltip></div>
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
	.bag {
		background-color: rgb(255, 230, 205);
	}
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
	.explosive {
		background-color: rgb(255, 205, 205);
	}
	.armour {
		background-color: rgb(255, 230, 205);
	}
	.resource {
		background-color: rgb(255, 230, 155);
	}
	.blueprint {
		background-color: rgb(255, 205, 255);
	}
	.misc {
		background-color: #EEE;
	}
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
	.unique {
		width: 12px;
		height: 12px;
		position: absolute;
		top: 0px;
		right: 0px;
	}
	.quantity {
		position: absolute;
		top: -3px;
		right: 1px;
		text-shadow: 1px 0 0 #EEE, 1px 1px 0 #EEE, 0 1px 0 #EEE, -1px 1px 0 #EEE, -1px 0 0 #EEE, -1px -1px 0 #EEE, 0 -1px 0 #EEE, 1px -1px 0 #EEE;
		opacity: 0.9;
		font-size: 0.9em;
	}
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
