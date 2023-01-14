<script>
	import Caption from './Caption.svelte';
	import Row from './Row.svelte';

	export let coordinates;
	export let current;
	export let encampment;
	export let players;
	export let rows;

	let clicked = false;
	let over = false;
	$: open = over || clicked;
</script>

<div>
	<table>
		<tr>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-mouse-events-have-key-events -->
			<td class="mark" class:clicked
				on:click={() => clicked = !clicked}
				on:mouseenter={() => (over = true)}
				on:mouseleave={() => (over = false)}>
				<img src="./question-mark.png" alt="Légende de la carte">
			</td>
			{#each rows as row, i}
				<td>{row[i].coordinate.substring(1)}</td>
			{/each}
		</tr>
		{#each rows as row}
			<Row {row} {encampment} {current} {coordinates} {players} />
		{/each}
	</table>
	<Caption {open} />
</div>

<style>
	div {
		position: relative;
	}
	td {
		width: 26px;
		height: 26px;
		text-align: center;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		transition: box-shadow 0.3s ease;
	}
	.mark {
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	img {
		width: 20px;
		height: 20px;
	}
	.clicked {
		box-shadow: 0 2px 6px rgba(48, 48, 48, 0.48), 0 1px 4px rgba(96, 96, 96, 0.96);
	}
</style>
