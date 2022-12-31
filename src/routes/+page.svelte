<script>
	export let data;
	const { users } = data;
	console.log(JSON.parse(users));
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#each JSON.parse(users) as user}
	{user.username} - {user.password}
{/each}
