<script>
    export let message;
    export let urgent;
</script>

<div>
    <h4>Message du jour ({message.username}) :</h4>
    <span>{message.message}</span>
</div>
{#if urgent}
    {#each urgent as message}
        <div class="urgent">
            <h4>Message urgent ({message.username}) :</h4>
            <span>{message.message}</span>
        </div>
    {/each}
{/if}

<style>
    div {
        padding: 0.5em;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0 0 0.5em 0.5em;
		background-color: #eee;
    }
    h4 {
        display: inline-block;
    }
    .urgent {
        margin-top: 1px;
        color: red;
    }
</style>
