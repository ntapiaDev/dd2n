<script>
    import Blueprint from "./actions/Blueprint.svelte";
    import Map from "./actions/Map.svelte";
	import Drink from "../map/actions/Drink.svelte";
    import Eat from "../map/actions/Eat.svelte";
	import Heal from "../map/actions/Heal.svelte";

    export let user;
</script>

<div>
    <span>Actions disponibles :</span>
    <Map />
    <Blueprint {user} />
    <Eat {user} />
    <Drink {user} />
    <Heal {user} />
</div>

<style>
    div {
		width: 293px;
		margin-top: 0.5em;
		padding: 0.5em;
		display: grid;
		grid-template-columns: repeat(11, 1fr);
		gap: 1px 0;
        border: 1px solid #aaa;
	}
	span {
		height: 25px;
		grid-column: 1 / 7;		
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #EEE;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0.25em;
	}
</style>
