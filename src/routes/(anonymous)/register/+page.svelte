<script>
	import { enhance } from '$app/forms';

	export let form;
</script>

<form method="POST" action="?/register" use:enhance>
	<h1>Enregistrement</h1>
	<!-- Flash message?? -->
	{#if form?.invalid}
		<p>Merci de remplir tous les champs.</p>
	{:else if form?.user}
		<p>Ce nom d'utilisateur est déjà pris.</p>
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
