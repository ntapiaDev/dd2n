<script>
	import { enhance } from '$app/forms';
	import Item from '../../game/Item.svelte';

    const item = {
		attack: 0,
		credit: 'Freepik',
		defense: 0,
		description: 'Laisser un message',
		icon: 'write',
		id: 'e6f9dc67-f4e1-4b66-8192-0b27fccce49e',
		rarity: 'commun',
		type: 'misc',
		unique: false
	};

    let message = '';
</script>

<form method="POST" action="/map?/tchat" use:enhance>
    <input type="text" name="message" placeholder="Laisser un message pour la postérité (100 caractères maximum)" maxlength="100" bind:value={message}>
	<button>
		<Item {item} />
	</button>
</form>

<style>
	form {
		width: 100%;
		height: 25px;
        display: flex;
        align-items: center;
	}
    input {
		margin-right: 0.5em;
		padding: 0.1em 0.25em;
		flex-grow: 2;
		border: none;
		border-bottom: 1px solid #AAA;
	}
	button {
		border: none;
		background-color: transparent;
		cursor: pointer;
	}
</style>
