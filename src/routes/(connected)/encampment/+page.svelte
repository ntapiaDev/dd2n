<script>
	import { page } from '$app/stores';
	import { sortItems } from '$lib/loots';
	import { sidebar } from '../../../stores/sidebar';
	import Actions from '../../../components/encampment/Actions.svelte';
	import Attack from '../../../components/encampment/Attack.svelte';
	import Bank from '../../../components/encampment/Bank.svelte';
	import Navigate from '../../../components/encampment/Navigate.svelte';
	import Place from '../../../components/encampment/Place.svelte';
	import Players from '../../../components/encampment/Players.svelte';
	import Register from '../../../components/encampment/Register.svelte';
	import Workshop from '../../../components/encampment/Workshop.svelte';
	import Worksites from '../../../components/encampment/Worksites.svelte';
	import NextDay from '../../../components/game/NextDay.svelte';

	export let data;
	export let form;
	$: form = {} || $sidebar;

	$: encampment = data.encampment;
	$: user = $page.data.user;
	$: worksites = data.worksites;

	$: if (!encampment.workshop.unlocked && $sidebar === 'workshop') sidebar.update(value => value = 'register');
	const open = (e) => sidebar.update(value => value = e.detail.open);
</script>

{#if user.role === 'admin'}
	<aside>
		<NextDay />
	</aside>
{/if}
<h1>Vous êtes dans votre campement :</h1>
<section>
	<div class="sidebar">
		<Attack attack={encampment.attack} completed={encampment.worksites.completed} players={encampment.players} slots={data.slots} {worksites} />
		<Actions {user} />
		<Navigate selected={$sidebar} on:clicked={open} workshop={encampment.workshop.unlocked} />
		<Players encampment={encampment.players} game={$page.data.game.players} lastDate={data.lastDate} />
	</div>
	<div class="content">
		{#if $sidebar === 'register'}
			<Register logs={data.logs} />
		{:else if $sidebar === 'place'}
			<Place />
		{:else if $sidebar === 'bank'}
			<Bank items={sortItems(encampment.items)} />
		{:else if $sidebar === 'worksites'}
			<Worksites encampment={encampment.worksites} {worksites} />
		{:else if $sidebar === 'workshop'}
			<Workshop encampment={encampment.workshop.recipes} recipes={data.recipes} unlocked={encampment.workshop.unlocked} />
		{/if}
		<div class="error">
			{#if form?.already}
				<p>Ce chantier est déjà débloqué.</p>
			{:else if form?.ap}
				<p>Vous n'avez pas assez de points d'action pour effectuer cette action.</p>
			{:else if form?.completed}
				<p>Ce chantier est déjà terminé.</p>
			{:else if form?.full}
				<p>Votre inventaire est plein.</p>
			{:else if form?.locked}
				<p>L'atelier de recyclage n'a pas encore été débloqué.</p>
			{:else if form?.materials}
				<p>Il n'y a pas assez de ressources pour réaliser cette recette.</p>
			{:else if form?.more}
				<p>Davantage de points d'action sont nécessaires pour réaliser cette recette.</p>
			{:else if form?.nothing}
				<p>Vous devez utiliser des points d'action pour construire ce chantier.</p>
			{:else if form?.origin}
				<p>Cet objet n'est pas présent dans la banque ou dans votre inventaire.</p>
			{:else if form?.recipe}
				<p>Cette recette est déjà débloquée.</p>
			{:else if form?.resources}
				<p>Il n'y a pas assez de ressources pour construire ce chantier.</p>
			{:else if form?.toMuch}
				<p>Vous avez dépensé trop de points d'actions pour ce chantier.</p>
			{:else if form?.unknown}
				<p>Cette recette n'est pas encore débloquée.</p>
			{:else if form?.unlocked}
				<p>Ce chantier n'est pas encore débloqué.</p>
			{:else if form?.workshop}
				<p>L'atelier est déjà débloqué.</p>
			{/if}
		</div>
	</div>
</section>

<style>
	aside {
		padding: 1em;
		position: absolute;
		top: 25px;
		left: 25px;
		border-radius: 1em;
		background-color: rgb(255, 255, 255, 0.25);
	}
	h1 {
		margin: 1em 0 0;
		text-align: center;
	}
	section {
		min-height: 600px;
		margin: 1em;
		display: flex;
		flex-grow: 1;
		flex-basis: 50px;
		overflow-y: hidden;
	}
	.content {
		margin-left: 1em;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}
	p {
		/* Inspiré de Bootstrap Alerts */
		margin: 1rem 0 0;
		padding: 0.75rem 1.25rem;
		color: #721c24;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 0.25rem;
	}
</style>
