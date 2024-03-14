<script>
    import { page } from '$app/stores';

    $: path = $page.url.pathname;
</script>

<nav data-hs-accordion-always-open>
    <ul class="space-y-5 variant-filled">
        <li>
            <a href="/app/chats" class:active={path === "/app/chats"}> 
                Chats
            </a>
        </li>
        <li >
            <a href="/app/docs" class:active={path === "/app/docs"}>
                Docs
            </a>
        </li>

    </ul>
</nav>

<style>
    nav {
        height: 100vh;
        width: 20rem;
    }

    ul {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        width: 100%;
        /* background-color: black; */
    }

    li {
        padding: 0.5rem;
        width: 100%;
        cursor: pointer;
        list-style: none;
        display: flex;
    }
    a {
        padding: 0.5rem;
        width: 100%;
        background-color: grey;
        border-radius: 5px;
        color: black;
        text-decoration: none;
        font-weight: 500;  
        text-align: center;      
    }

    a.active {
        background-color: white;
        color: black;
    }
</style>