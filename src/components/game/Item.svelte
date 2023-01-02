<script>
    import { page } from '$app/stores';
    import { items } from '../../stores/items';
    import { tooltip } from './tooltip';

    export let id;

    const item = $items.find(i => i.id === id);
</script>

<!-- Remplacer par BASEURI ou équivalent?? -->
<img src={$page.url.origin + "/icons/" + item.icon + ".png"} alt={item.icon} title={item.description} use:tooltip>

<style>
    img {
        width: 20px;
        height: 20px;
        position: relative;
        top: 3px;
    }
</style>
