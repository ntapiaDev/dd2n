<script>
	import { enhance } from '$app/forms';

	export let form;
</script>

<h1>Administration du site</h1>

<section>
	<h2>Ajouter des icones :</h2>
	<form method="POST" action="?/item" use:enhance>
		<div class="infos">
			<input type="text" id="icon" name="icon" placeholder="icon" required />
			<input type="text" id="description" name="description" placeholder="description" required />
		</div>
		<div class="stats">
			<input type="number" min="1" max="100" id="attack" name="attack" placeholder="attack" />
			<input type="number" min="1" max="100" id="defense" name="defense" placeholder="defense" />
			<input type="number" min="1" max="1" id="hunger" name="hunger" placeholder="hunger" />
			<input type="number" min="1" max="1" id="thirst" name="thirst" placeholder="thirst" />
			<input type="number" min="1" max="1" id="disease" name="disease" placeholder="disease" />
            <button type="submit">Ajouter</button>
		</div>
	</form>
	<h2>Liste des icones :</h2>
    <!-- TODO ICON LIST -->
</section>

<style>
	h1 {
		margin: 1em 0 0;
		text-align: center;
	}
	section {
		padding: 1em;
	}
	form {
		margin: 1em 0;
	}
    input {
        text-align: center;
    }
    .infos {
        margin-bottom: 3px;
    }
    .infos input:nth-child(1) {
		width: 153px;
	}
    .infos input:nth-child(2) {
		width: 293px;
	}
	.stats input {
		width: 75px;
	}
</style>
