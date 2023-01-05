<script>
	import { enhance } from '$app/forms';
	import { user } from '../../stores/user';
	import { canTravel } from '../../utils/tools';

	export let cell;
	export let encampment;

	$: travel = canTravel($user.location, cell.coordinate, cell.layout.border) && $user.ap > 0;
	$: style = (encampment === cell.coordinate ? 'encampment ' : '') +
	($user.location === cell.coordinate ? 'current ' : '') +
	(travel ? 'travel ' : '') +
	(cell.visible ? 
		((cell.layout.border.includes(1) ? 'bt ' : '') +
		(cell.layout.border.includes(2) ? 'br ' : '') +
		(cell.layout.border.includes(3) ? 'bb ' : '') +
		(cell.layout.border.includes(4) ? 'bl ' : '') +
		(cell.visited || travel ? '' : 'blur'))
	: 'fog')
</script>

<td	class={style}
	style={encampment !== cell.coordinate && cell.visible ? `background-color: rgb(255, 0, 0, ${cell.zombies / 16})` : ''}>
	{#if travel}
		<form method="POST" action="?/travel" use:enhance>
			<input type="text" name="target" value={cell.coordinate} hidden>
			<button>{cell.coordinate === encampment ? 'C' : (cell.visible && cell.visited ? cell.zombies : '?')}</button>
		</form>
	{:else if cell.visible && cell.visited}
		{cell.coordinate === encampment ? 'C' : cell.zombies}
	{/if}
</td>

<style>
	td {
		width: 26px;
		height: 26px;
		text-align: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		transition: box-shadow ease 0.3s;
	}
	td.encampment {
		color: #fff;
		background-color: blue;
	}
	td.current {
		border: 3px double blue;
	}
	td.travel:hover {
		box-shadow: 0 2px 6px rgba(0, 0, 255, 0.48), 0 0 10px rgba(0, 0, 255, 0.96);
	}
	button {
		width: 100%;
		height: 100%;
		cursor: pointer;
	}
	td.bt {
		border-top: 1px solid black;
	}
	td.br {
		border-right: 1px solid black;
	}
	td.bb {
		border-bottom: 1px solid black;
	}
	td.bl {
		border-left: 1px solid black;
	}
	.fog {
		background: content-box radial-gradient(rgb(100, 100, 100), rgb(128, 128, 128));
	}
	.blur {
		filter : blur(1px);
	}
</style>
