<script>
	import { tooltip } from "../game/tooltip";

    export let locked = false;
    export let selected;
    export let urgent = undefined;
    export let title;
</script>

{#if locked}
    <span class="locked" title="L'atelier n'a pas encore été débloqué" use:tooltip>
        {title}
    </span>
{:else}
    <span class:selected>
        {title}
        {#if urgent?.length}
            <span class="urgent">{`(+${urgent.length})`}</span>
        {/if}
    </span>
{/if}

<style>
    span:not(.urgent) {
        height: 25px;
        display: flex;
		align-items: center;
		justify-content: center;
        background-color: #EEE;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0.25em;
        cursor: pointer;
    }
    span.selected {
        box-shadow: 0 2px 6px rgba(48, 48, 48, 0.48), 0 1px 4px rgba(96, 96, 96, 0.96);
    }
    span.locked {
        background-color: #DDD;
        color: rgb(100, 100, 100);
        cursor: default;
    }
    .urgent {
        margin-left: 4px;
        color: red;
        font-weight: bold;
    }
</style>
