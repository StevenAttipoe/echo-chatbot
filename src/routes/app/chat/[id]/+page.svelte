<script lang="ts">
    import Pulse from '$lib/components/Pulse.svelte';
    import { getMessages, saveMessage, deleteMessages } from "$lib/services/firestore";
    import { writable } from 'svelte/store';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let message: string;
    let isLoading = false;
    let chatId = $page.params.id;

    let messages = writable<Message[]>([]);

    onMount(async () => {
      const messageHistory = await getMessages(chatId);
      messages.set(messageHistory);
    });
    
    async function updateChat(message: Message) {
        messages.update((msgs) => [...msgs, message]);
        await saveMessage(message, chatId);
    }

    async function handleChat() {
        if (message === "") return;

        isLoading = true;

        updateChat({ 
          sequenceNumber: $messages.length + 1,
          role: "user", 
          content: message 
        });

        const tempMessage = message;
        message = "";

        await fetch('/api/chat-no-stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: tempMessage, history: $messages }),
        }).then(async (response) => {
            const data = await response.json();

            updateChat({ 
              sequenceNumber: $messages.length + 1,
              role: "assistant", 
              content: data.content, 
              documents: data.documents ? data.documents : []
            });

        });
        
        isLoading = false;
    }

    async function handleDeleteMessages(chatId: string) {
      await deleteMessages(chatId);
      goto('/app/chats');
    }
  
  </script>
    
  <section class="w-full h-screen max-h-screen">
      <button 
        on:click={() => goto('/app/chats')} 
        class="px-10 pt-5 text-black text-sm cursor-pointer">
        🔙 Back
      </button>

      <div class="px-10 py-5">
        <div class="flex w-full flex-row justify-between">
          <h1>  Ask me something </h1>
          <button on:click={() => handleDeleteMessages(chatId)} class="btn btn-sm variant-filled"> Delete Messages </button>
        </div>
  
          <div class="flex flex-col w-full max-w-screen-md mx-auto h-screen">
              <div class="w-full flex flex-col h-3/4 space-y-6 py-4 overflow-y-auto">
                {#each $messages as message}
                    {#if message.role === "assistant"}
                        <div class="grid grid-cols-[auto_1fr] gap-2">
                            <div class="card p-4 variant-soft rounded-tr-none space-y-2">
                                <header class="flex justify-between items-center">
                                    <p class="font-bold">{message.role.toUpperCase()}</p>
                                    <small class="opacity-50"> { new Date().toLocaleDateString() } </small>
                                </header>
                                <p>{message.content}</p>
                            </div>
                        </div>

                        {#each message.documents ?? [] as document}
                          <div class="flex flex-row items-center space-x-4 px-2 border-2 rounded-md h-10">
                            <img class="w-5 h-5" src="/svg/doc.svg" alt="doc-svg">
                            <p>{document}</p>
                          </div>
                        {/each}

                      {:else}
                        <div class="grid grid-cols-[1fr_auto] gap-2">
                            <div class="card p-4 rounded-tr-none space-y-2 bg-blue-200">
                                <header class="flex justify-between items-center">
                                    <p class="font-bold">{message.role.toUpperCase()}</p>
                                    <small class="opacity-50"> { new Date().toLocaleDateString() } </small>
                                </header>
                                <p>{message.content}</p>
                            </div>
                        </div>
                    {/if}
                
                  {:else}  
                    <div class="w-full h-full flex justify-center items-center align-middle">
                      <p class="text-black"> No chats yet</p>
                    </div>
                    
                {/each}
            
                {#if isLoading}
                  <Pulse />
                {/if}
              </div>
        
            
              <form on:submit|preventDefault={handleChat}  class="flex flex-col w-full" >
                <input 
                  bind:value={message} 
                  type="text" 
                  placeholder="Ask your question..." 
                  class="h-14 px-3 border border-gray-200 disabled:bg-gray-50" 
                />
            
                <div class="font-medium text-xs text-gray-400 mt-1.5">
                  {#if !isLoading}
                    <div class="w-full flex items-center justify-between">
                      <p>Press enter to ask...</p>
                    </div>
                  {:else}
                    <p class="animate-pulse">
                      Analysing the knowledge base...
                    </p>
                  {/if}
                </div>
              </form>
          </div>
      </div>
     
  </section>