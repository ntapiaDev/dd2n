<script>
	import { enhance } from '$app/forms';

	export let form;

	let username = '';
	let password = '';
	let repeat = '';
	let gender = 'male';

	// REGEX Username
	const USER_REGEX = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9_]{2,15}$/;
	$: testUsername = !USER_REGEX.test(username);
	// REGEX Password
	const LENGTH_REGEX = /^.{8,}$/;
	$: testLength = !LENGTH_REGEX.test(password);
	const MIN_REGEX = /.*[a-z].*/;
	$: testMin = !MIN_REGEX.test(password);
	const MAJ_REGEX = /.*[A-Z].*/;
	$: testMaj = !MAJ_REGEX.test(password);
	const NUMBER_REGEX = /.*[0-9].*/;
	$: testNumber = !NUMBER_REGEX.test(password);
	const CHAR_REGEX = /.*[#?!@$%^&*-].*/;
	$: testChar = !CHAR_REGEX.test(password);
	$: testPassword = testLength || testMin || testMaj || testNumber || testChar;
	$: testRepeat = password !== repeat;
</script>

<form method="POST" action="?/register" use:enhance>
	<h1>Enregistrement</h1>
	{#if form?.invalid}
		<p>Merci de remplir tous les champs.</p>
	{:else if form?.user}
		<p>Ce nom d'utilisateur est déjà pris.</p>
	{:else if form?.username}
		<p>Votre nom d'utilisateur doit faire entre 3 et 16 caractères, sans caractères spéciaux.</p>
	{:else if form?.password}
		<p>Votre mot de passe doit comporter au minimum 8 caractères et contenir au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial.</p>
	{:else if form?.repeat}
		<p>Votre mot de passe et votre confirmation ne sont pas identiques.</p>
	{:else if form?.gender}
		<p>Vous devez renseigner un genre valide.</p>
	{/if}
	<label for="username">Nom d'utilisateur :</label>
	<div class="username">
		<div class="regex" class:testUsername>
			<div class:testUsername>Entre 3 et 16 caractères, sans caractères spéciaux.</div>
		</div>
		<input type="text" id="username" name="username" bind:value={username} />
	</div>	
	<label for="password">Mot de passe :</label>
	<div class="password">
		<div class="regex" class:testPassword>
			<div class:testLength>Doit comporter au minimum 8 caractères.</div>
			<div class:testMin>Contient au moins une lettre minuscule.</div>
			<div class:testMaj>Contient au moins une lettre majuscule.</div>
			<div class:testNumber>Contient au moins un chiffre.</div>
			<div class:testChar>Contient au moins un caractère spécial.</div>
		</div>
		<input type="password" id="password" name="password" bind:value={password} />
	</div>
	<label for="repeat">Répétez votre mot de passe :</label>
	<div class="repeat">
		<div class="regex" class:testRepeat>
			<div class:testRepeat>Votre mot de passe et votre confirmation doivent être identiques.</div>
		</div>
		<input type="password" id="repeat" name="repeat" bind:value={repeat} />
	</div>
	<label for="gender">Choisissez votre genre :</label>
	<select name="gender" id="gender" bind:value={gender}>
		<option value="male">Masculin (défaut)</option>
		<option value="female">Féminin</option>
	</select>
	<button type="submit" disabled={testUsername || testPassword || testRepeat}>Envoyer</button>
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
		width: 100%;
		margin: 1em 0;
	}
	p,
	.regex.testUsername,
	.regex.testPassword,
	.regex.testRepeat {
		/* Inspiré de Bootstrap Alerts */
		margin: 1rem 0;
		padding: .75rem 1.25rem;
		color: #721c24;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: .25rem;
	}
	.regex {
		display: none;
	}
	.username:focus-within .regex,
	.password:focus-within .regex,
	.repeat:focus-within .regex {
		display: block;
	}
	.regex div {
		display: none;
	}
	.regex .testUsername,
	.regex .testLength,
	.regex .testMin,
	.regex .testMaj,
	.regex .testNumber,
	.regex .testChar,
	.regex .testRepeat {
		display: block;
	}
	select {
		margin: 1em 0;
	}
</style>
