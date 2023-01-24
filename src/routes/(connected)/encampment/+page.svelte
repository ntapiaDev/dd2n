<script>
	import { page } from '$app/stores';

	export let data;
	export let form;
</script>

<h1>Vous êtes dans votre campement :</h1>
<section>
	
</section>

<style>
	h1 {
		margin: 1em 0 0;
		text-align: center;
	}
	section {
		margin: 1em;
		display: flex;
		flex-grow: 1;
		flex-basis: 50px;
		overflow-y: hidden;
	}
	p {
		/* Inspiré de Bootstrap Alerts */
		margin: 1rem 0 0;
		padding: 0.75rem 1.25rem;
		color: #721c24;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 0.25rem;
	}
</style>
