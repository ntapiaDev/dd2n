<script>
    import { tooltip } from './tooltip';

    export let icon;
    export let title;
</script>

<img src={"./icons/" + icon + ".png"} alt={icon} {title} use:tooltip>

<style>
    img {
        width: 20px;
        height: 20px;
        position: relative;
        top: 3px;
    }
</style>
