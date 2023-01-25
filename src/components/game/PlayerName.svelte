<script>
    export let color;
    export let username;

    $: color += '80';
</script>

<span style={`text-shadow: 1px 0 0 ${color}, 1px 1px 0 ${color}, 0 1px 0 ${color}, -1px 1px 0 ${color}, -1px 0 0 ${color}, -1px -1px 0 ${color}, 0 -1px 0 ${color}, 1px -1px 0 ${color}`}>
    {username}
</span>

<style>
    span {
        color: #FFF;
    }
</style>
