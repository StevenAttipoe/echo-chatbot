<script lang="ts">
    import { goto } from "$app/navigation";
    import { createChat, getChats } from "$lib/services/firestore";
    import Loader from '$lib/components/Loader.svelte';

    let chats: Promise<Chat[]> = getChats();

    async function handleStartNewChat() {
        const chat = await createChat();
        goto(`/app/chat/${chat.id}`);
    }
    
</script>

<section class="w-full h-screen overflow-y-auto">
    <div class="p-16 space-y-4">
        <h1> Chats </h1>

        <button 
            class="btn btn-sm variant-filled"
            on:click={handleStartNewChat}
        >
        + Start New Chat
      </button>
        {#await chats}
            <div class="w-full flex justify-center">
                <Loader width={1.5} height={1.5} />
            </div>
        {:then chats}
            {#each chats as chat}
                <a
                    href="/app/chat/{chat.id}"
                    class="p-5 w-full flex flex-row space-x-4 border-2 rounded-md cursor-pointer"
                    data-sveltekit-preload-data="hover"
                >
                    <img class="w-5 h-5" src="/svg/chat.svg" alt="chat-svg">
                    <p>{chat.name}</p>
                </a>
            {/each}
        {:catch}
            <div class="w-full flex justify-center">
                <p>Could not load chats</p>
            </div>
        {/await}

    </div>

</section>