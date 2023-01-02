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
	<label for="username">Nom d'utilisateur :</label>
	<input type="text" id="username" name="username" />
	<label for="password">Mot de passe :</label>
	<input type="password" id="password" name="password" />
	<button type="submit">Envoyer</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		padding: 1em;
		border: 1px solid #AAA;
		border-radius: 1em;
	}
	h1 {
		text-align: center;
	}
	input {
		margin: 1em 0;
	}
	p {
		/* Inspiré de Bootstrap Alerts */
		margin: 1rem 0;
		padding: .75rem 1.25rem;
		color: #721c24;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: .25rem;
	}
</style>
