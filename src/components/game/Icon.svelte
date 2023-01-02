<script>
    import { page } from '$app/stores';
    import { tooltip } from './tooltip';

    export let icon;
    export let title;
</script>

<!-- Remplacer par BASEURI ou équivalent?? -->
<img src={$page.url.origin + "/icons/" + icon + ".png"} alt={icon} {title} use:tooltip>

<style>
    img {
        width: 20px;
        height: 20px;
        position: relative;
        top: 3px;
    }
</style>
