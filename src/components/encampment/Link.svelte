<script>
    export let selected;
    export let title;
</script>

<span class:selected>
    {title}
</span>

<style>
    span {
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
</style>
