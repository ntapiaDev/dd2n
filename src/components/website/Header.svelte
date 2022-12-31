<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<header>
	<a href="/">Die2Nite - Reborn</a>
	<nav>
		{#if !$page.data.user}
			<a href="/login">Login</a>
			<a href="/register">Register</a>
		{:else if $page.data.user}
			<a href="/map">Go to map</a>
			<form method="POST" action="/logout" use:enhance>
				<button type="submit">Logout</button>
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
