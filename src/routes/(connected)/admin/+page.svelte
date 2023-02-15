<script>
	import { sortItems } from '$lib/loots';
	import Items from "../../../components/admin/Items.svelte";
	import Workshop from '../../../components/admin/Workshop.svelte';
	import Worksites from '../../../components/admin/Worksites.svelte';

	export let data;

	let selected = 'items';
</script>

<h1>Administration du site</h1>
<section>
	<div class="content">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div class="menu">
			<div on:click={() => selected = 'items'}>Items</div>
			<div on:click={() => selected = 'worksites'}>Chantiers</div>
			<div on:click={() => selected = 'workshop'}>Atelier</div>
		</div>
		{#if selected === 'items'}
			<Items items={sortItems(data.items)} />
		{:else if selected === 'worksites'}
			<Worksites groups={data.groups} resources={data.resources} tavern={data.tavern} worksites={data.worksites} />
		{:else if selected === 'workshop'}
			<Workshop items={sortItems(data.items.filter(i => !['blueprint', 'misc'].includes(i.type)))} recipes={data.recipes} workshop={data.workshop} />
		{/if}
	</div>
</section>

<style>
	h1 {
		margin: 1em 0 0;
		text-align: center;
	}
	section {
		padding: 1em;
		display: flex;
		flex-grow: 1;
		flex-basis: 50px;
		overflow-y: hidden;
	}
	.content {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}
	.menu {
		display: flex;
		margin-bottom: 1em;
		cursor: pointer;
	}
	.menu div {
		width: calc(1/3 * 100%);
		height: 25px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #EEE;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0.25em;
	}
</style>
