<script>
	import { page } from '$app/stores';
	import Row from './Row.svelte';

	export let encampment;
	export let rows;
</script>

<table>
	<tr>
		<td>{$page.data.user.days}</td>
		{#each rows as row, i}
			<td>{row[i].coordinate.substring(1)}</td>
		{/each}
	</tr>
	{#each rows as row}
		<Row {row} {encampment} />
	{/each}
</table>

<style>
	td {
		width: 25px;
		height: 25px;
		text-align: center;
		box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
	}
</style>
