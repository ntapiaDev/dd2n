<script>
    import { createEventDispatcher } from 'svelte';
	import Link from "./Link.svelte";

    export let selected;
    export let urgent;
    export let workshop;

    const dispatch = createEventDispatcher();

    const open = (component) => {
        dispatch('clicked', {
			open: component
		});
    }
</script>

<nav>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <ul>
        <li on:click={() => open('register')}>
            <Link selected={selected === 'register'} title="Registre central" />
        </li>
        <li on:click={() => open('place')}>
            <Link selected={selected === 'place'} {urgent} title="Place du village" />
        </li>
        <li on:click={() => open('bank')}>
            <Link selected={selected === 'bank'} title="Banque commune" />
        </li>
        <li on:click={() => open('worksites')}>
            <Link selected={selected === 'worksites'} title="Chantiers de défense" />
        </li>
        <li on:click={workshop ? () => open('workshop') : ''}>
            <Link selected={selected === 'workshop'} title="Atelier de recyclage" locked={!workshop} />
        </li>
    </ul>
</nav>

<style>
    nav {
        margin-top: 0.5em;
		padding: 0.5em;
        border: 1px solid #aaa;
	}
    ul {
        list-style: none;
    }
    li + li {
        margin-top: 0.25em;
    }
</style>
