<script>
	import { user } from "../../stores/user";

	export let cell;
    export let encampment;

	const canTravel = () => {
		const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']; //16 * 16 = 256 cases max
		const distance = Math.abs(letters.indexOf($user.location[0]) - letters.indexOf(cell.coordinate[0])) + Math.abs(cell.coordinate.substring(1) - $user.location.substring(1)) === 1;
		if (distance) return !cell.layout.border.includes(direction(letters));
		return distance;
	}
	const direction = (letters) => {
		if ($user.location[0] === cell.coordinate[0]) {
			return $user.location.substring(1) - cell.coordinate.substring(1) > 0 ? 2 : 4;
		} else if (cell.coordinate.substring(1) === $user.location.substring(1)) {
			return letters.indexOf(cell.coordinate[0]) - letters.indexOf($user.location[0]) > 0 ? 1 : 3;
		}
	}

	const travel = () => {
		if(canTravel()) console.log(cell.coordinate);
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<td	class="{encampment === cell.coordinate ? 'encampment' : ''}
	{$user.location === cell.coordinate ? 'current' : ''}
	{canTravel() ? 'travel' : ''}
	{cell.layout.border.includes(1) ? 'bt' : ''}
	{cell.layout.border.includes(2) ? 'br' : ''}
	{cell.layout.border.includes(3) ? 'bb' : ''}
	{cell.layout.border.includes(4) ? 'bl' : ''}"
	style={encampment !== cell.coordinate ? `background-color: rgb(255, 0, 0, ${cell.zombies / 16})` : ''}
	on:click={travel}>
	{cell.zombies}
</td>

<style>
	td {
		width: 25px;
		height: 25px;
		text-align: center;
		box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
		transition: 0.3s;
	}
	td.encampment {
		color: #fff;
		background-color: blue;
	}
	td.current {
		border: 3px double blue;
	}
	td.travel:hover {
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(0,0,255,0.48), 0 0 10px rgba(0,0,255,0.96);
	}
	/* Bordures de la zone */
	.bt {
		border-top: 1px solid black;
	}
	.br {
		border-right: 1px solid black;
	}
	.bb {
		border-bottom: 1px solid black;
	}
	.bl {
		border-left: 1px solid black;
	}
</style>
