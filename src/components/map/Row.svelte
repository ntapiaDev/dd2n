<script>
    import Cell from "./Cell.svelte";

	export let coordinates;
	export let current;
	export let players;
	export let row;
	export let encampment;
</script>

<tr>
	<td>{row[0].coordinate[0]}</td>
	{#each row as cell}
		<Cell {cell} {encampment} {current} {coordinates} {players} />
	{/each}
</tr>

<style>
	td {
		width: 25px;
		height: 25px;
		text-align: center;
		box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
	}
</style>
