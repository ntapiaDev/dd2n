<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { canTravel } from '../../utils/tools';

	export let cell;
	export let coordinates;
	export let current;
	export let encampment;
	export let players;

	let loots = 0
	$: if (coordinates) loots = 0;
	$: for (let coordinate of coordinates) {
		if (coordinate.coordinates === cell.coordinate) {
			loots += coordinate.quantity;
		}
	}

	$: travel = canTravel($page.data.user.location, cell.coordinate, cell.layout.border)
		&& $page.data.user.ap > 0
		&& (current.zombies <= (($page.data.user.slots.A1.defense ?? 0) + ($page.data.user.slots.A2.defense ?? 0) + ($page.data.user.slots.A3.defense ?? 0)) || $page.data.user.force);
	$: style = coordinates.find(i => i.coordinates === cell.coordinate) ? 'show-coordinates' :
	players.find(p => p.coordinate === cell.coordinate) ? 'show-players' :
	((encampment === cell.coordinate ? 'encampment ' : '') +
	($page.data.user.location === cell.coordinate ? 'current ' : '') +
	(travel ? 'travel ' : '') +
	(cell.layout.danger === 1 ? 'inner ' : '') +
	(cell.layout.danger === 2 ? 'middle ' : '') +
	(cell.layout.danger === 3 ? 'outer ' : '') +
	(cell.visible ?
		((cell.layout.border.includes(1) ? 'bt ' : '') +
		(cell.layout.border.includes(2) ? 'br ' : '') +
		(cell.layout.border.includes(3) ? 'bb ' : '') +
		(cell.layout.border.includes(4) ? 'bl ' : '') +
		(cell.building ? 'building ' : '') +
		(cell.entrance ? 'tunnel ' : '') +
		(((cell.visited && cell.empty) || (!cell.visited && cell.estimated.empty)) ? 'empty ' : '') +
		((cell.visited && cell.building?.empty) ? 'empty-building ' : '') +
		(cell.visited ? '' : 'blur'))
	: 'fog'))
</script>

<td	class={style}
	style={encampment !== cell.coordinate && cell.visible ? `background-color: rgb(255, 0, 0, ${cell.visited ? (cell.zombies / 32) : (cell.estimated.zombies / 32)})` : ''}>
	{#if travel}
		<form method="POST" action="?/travel" use:enhance>
			<input type="text" name="target" value={cell.coordinate} hidden>
			<input type="text" name="ti" value={cell.i} hidden>
			<input type="text" name="tj" value={cell.j} hidden>
			<button>{coordinates.length ? (loots === 0 ? '-' : loots) :
			players.length ? (players.find(p => p.coordinate === cell.coordinate) ? players.find(p => p.coordinate === cell.coordinate).username[0] : '-') :
			(cell.coordinate === encampment ? 'C' : (cell.visible ? (cell.visited ? cell.zombies : cell.estimated.zombies) : '?'))}</button>
		</form>
	{:else if cell.visible}
		{coordinates.length ? (loots === 0 ? '-' : loots) :
		players.length ? (players.find(p => p.coordinate === cell.coordinate) ? players.find(p => p.coordinate === cell.coordinate).username[0] : '-') :
		(cell.coordinate === encampment ? 'C' : (cell.visited ? cell.zombies : cell.estimated.zombies))}
	{/if}
</td>

<style>
	td {
		width: 26px;
		height: 26px;
		text-align: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		text-shadow: 1px 0 0 #ddd, 1px 1px 0 #ddd, 0 1px 0 #ddd, -1px 1px 0 #ddd, -1px 0 0 #ddd, -1px -1px 0 #ddd, 0 -1px 0 #ddd, 1px -1px 0 #ddd;
		transition: box-shadow ease 0.3s;
	}
	td.encampment {
		color: #fff;
		background-color: blue;
		text-shadow: 1px 0 0 rgb(48, 48, 48), 1px 1px 0 rgb(48, 48, 48), 0 1px 0 rgb(48, 48, 48), -1px 1px 0 rgb(48, 48, 48), -1px 0 0 rgb(48, 48, 48), -1px -1px 0 rgb(48, 48, 48), 0 -1px 0 rgb(48, 48, 48), 1px -1px 0 rgb(48, 48, 48);
	}
	td.current {
		border: 3px double;
	}
	td.travel.inner:hover {
		box-shadow: 0 2px 6px rgba(0, 128, 0, 0.48), 0 0 10px rgba(0, 128, 0, 0.96);
	}
	td.travel.inner.encampment:hover {
		box-shadow: 0 2px 6px rgb(0, 0, 255, 0.48), 0 0 10px rgb(0, 0, 255, 0.96);
	}
	td.travel.middle:hover {
		box-shadow: 0 2px 6px rgb(255, 165, 0, 0.48), 0 0 10px rgb(255, 165, 0, 0.96);
	}
	td.travel.outer:hover {
		box-shadow: 0 2px 6px rgb(255, 0, 0, 0.48), 0 0 10px rgb(255, 0, 0, 0.96);
	}
	button {
		width: 25px;
		height: 24px;
		cursor: pointer;
	}
	.inner button {
		background-color: rgba(0, 128, 0, 0.25);
		border: 1px solid rgba(0, 128, 0, 0.48);
	}
	.inner.encampment button {
		color: #fff;
		background-color: rgb(0, 0, 255, 0.25);
		border: 1px solid rgb(0, 0, 255, 0.48);
	}
	.middle button {
		background-color: rgba(255, 165, 0, 0.25);
		border: 1px solid rgba(255, 165, 0, 0.48);
	}
	.outer button {
		background-color: rgba(255, 0, 0, 0.25);
		border: 1px solid rgba(255, 0, 0, 0.48);
	}
	td.bt button,
	td.bb button {
		height: 21px;
	}
	td.br button,
	td.bl button {
		width: 21px;
	}
	td.bt {
		border-top: 3px solid;
	}
	td.br {
		border-right: 3px solid;
	}
	td.bb {
		border-bottom: 3px solid;
	}
	td.bl {
		border-left: 3px solid;
	}
	td.building {
		border: 3px solid;
	}
	td.empty-building {
		border: 3px dotted;
	}
	td.tunnel {
		border: 3px dashed;
	}
	td.building button,
	td.tunnel button {
		width: 20px;
		height: 21px;
		margin-top: -1px;
	}
	td.inner {
		border-color: green;
	}
	td.inner.encampment {
		border-color: #fff;
	}
	td.middle {
		border-color: orange;
	}
	td.outer {
		border-color: red;
	}
	.fog {
		background: content-box radial-gradient(rgb(100, 100, 100), rgb(128, 128, 128));
	}
	.fog button {
		color: #fff;
	}
	.blur {
		filter : blur(1px);
	}
	.empty {
  		background-size: 4px 4px;
		background-position: center;
	}
	td.inner.empty {
		background-image: radial-gradient(rgb(0, 128, 0) 1px, transparent 0);
	}
	td.inner.encampment.empty {
		background-image: radial-gradient(rgb(96, 96, 255) 1px, transparent 0);
	}
	td.middle.empty {
		background-image: radial-gradient(orange 1px, transparent 0);
	}
	td.outer.empty {
		background-image: radial-gradient(red 1px, transparent 0);
	}
	.show-coordinates {
		border: 3px ridge rgb(255, 0, 0, 0.60);
		box-shadow: 0 2px 6px rgb(255, 0, 0, 0.48), 0 0 10px rgb(255, 0, 0, 0.72);
	}
	.show-players {
		border: 3px ridge rgb(0, 128, 0, 0.60);
		box-shadow: 0 2px 6px rgb(0, 128, 0, 0.48), 0 0 10px rgb(0, 128, 0, 0.72);
	}
	.show-coordinates button,
	.show-players button {
		width: 20px;
		height: 20px;
		border: none;
	}
</style>
