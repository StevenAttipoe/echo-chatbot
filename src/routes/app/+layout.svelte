<script lang="ts">
    import Sidebar from '$lib/components/Sidebar.svelte';
    import "../../app.css";
</script>

<main class="bg-amber-500">
    <Sidebar/>
    <slot />
</main>

<style>
    main {
        width: 100vw;
        height: 100vh;
        max-height: 100vh;
        overflow-y: hidden;
        display: flex;
        flex-direction: row;
        background-color: #f5f5f5;
        inset-inline-start: 0px;
        bottom: 0px;
        position: absolute;
    }

    :global(h1) {
        font-size: 1.25rem;
        font-weight: 600;
    }
</style>