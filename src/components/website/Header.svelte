<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<header>
	<a href="/">Don't Die 2Nite.</a>
	<nav>
		{#if !$page.data.user}
			<a href="/login">Connexion</a>
			<a href="/register">Enregistrement</a>
		{:else if $page.data.user}
			<a href="/map">Voir la carte</a>
			{#if $page.data.user.role === "admin"}
				<a href="/admin">Administrer le site</a>
			{/if}
			<form method="POST" action="/logout" use:enhance>
				<button type="submit">Se déconnecter</button>
			</form>
		{/if}
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		border: 1px solid black;
		background-color: #FFF;
		z-index: 100;
	}
	form {
		display: inline-block;
	}
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
	a, button {
		display: inline-block;
		padding: 0.5em;
		color: black;
		text-decoration: none;
	}
</style>
