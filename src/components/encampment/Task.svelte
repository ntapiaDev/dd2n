<script>
	import { formatDate } from '$lib/game';

    export let task;
</script>

<div style={`background-color: ${task.color? task.color + '20' : ''}`}>
    <span class="date">{task.username + ' - ' + formatDate(task)}</span>
    <span>{task.message}</span>
</div>

<style>
    div {
        margin-top: 1.5em;
        position: relative;
		padding: 0.5em;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		border-radius: 0 0 0.5em 0.5em;
		background-color: #eee;
    }
    .date {
		width: 100%;
		position: absolute;
		top: -15px;
        left: 0;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.12);
		border-radius: 1em 1em 0 0;
		font-size: 0.75em;
		background-color: #ddd;
        text-align: center;
		z-index: 5;
	}
</style>
