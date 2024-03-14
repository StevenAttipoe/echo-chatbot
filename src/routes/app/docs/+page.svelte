<script lang="ts">
  import UploadDoc from '$lib/components/UploadDoc.svelte';
  import { getUploadedFiles } from '$lib/services/documents';
  import Loader from '$lib/components/Loader.svelte';

  $: showUploadDropdown = false;
  let uploadedDocuments: Promise<Document[]> = getUploadedFiles();

</script>
  
  <section class="w-full h-screen overflow-y-auto">
    <div class="p-16 space-y-4">
      <h1> Uploaded Documents </h1>

      <button 
        class="btn btn-sm variant-filled"
        on:click={() => showUploadDropdown = !showUploadDropdown}
        >
        + Add Document
      </button>

      {#if showUploadDropdown}
        <UploadDoc bind:showUploadDropdown/>
      {/if}

      {#await uploadedDocuments}
        <div class="w-full flex justify-center">
          <Loader 
            width={1.5}
            height={1.5}
            />
        </div>

      {:then documents}

        {#if documents.length === 0}

          <p>
            No documents uploaded yet
          </p>

        {:else}

          {#each documents as document}

            <div class="flex flex-row items-center space-x-4 px-2 border-2 rounded-md h-10">
              <img class="w-5 h-5" src="/svg/doc.svg" alt="doc-svg">
              <p>{document.name}</p>
            </div>

          {/each}

        {/if}
      {:catch error}
        <p>Could not fetch documents</p>

      {/await}



    </div>
  </section>