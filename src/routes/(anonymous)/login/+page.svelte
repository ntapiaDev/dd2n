<script>
	import { enhance } from '$app/forms';

	export let form;
</script>

<form method="POST" action="?/login" use:enhance>
	<h1>Connexion</h1>
	<!-- Flash message?? -->
	{#if form?.invalid}
		<p>Merci de remplir tous les champs.</p>
	{:else if form?.credentials}
		<p>Nom d'utilisateur ou mot de passe incorrect.</p>
	{/if}
	<label for="username">Nom d'utilisateur</label>
	<input type="text" id="username" name="username" />
	<label for="password">Mot de passe</label>
	<input type="password" id="password" name="password" />
	<button type="submit">Envoyer</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
	}
	h1 {
		text-align: center;
	}
	input {
		margin: 1em 0;
	}
</style>
