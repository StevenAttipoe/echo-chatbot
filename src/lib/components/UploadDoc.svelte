<script lang="ts">
    import { embedAndIndexDocumentsToPincone, uploadFile } from '$lib/services/documents';
    import { slide } from "svelte/transition";
    import toast, { Toaster } from "svelte-french-toast";
    import Loader from '$lib/components/Loader.svelte';

    export let showUploadDropdown: boolean;

    let pdfFiles: FileList;
    let isLoading: boolean = false;

    async function handleFileUpload(pdfFiles: FileList){
      const pdfFile = pdfFiles.item(0);

      if (!pdfFile) return;

      isLoading = true;
      const uploadStatus = await uploadFile(pdfFile);

      if (uploadStatus === true){
        toast.success("File uploaded successfully");
      } else {
        toast.error("File upload failed");
      }


      toast("Embedding and indexing document", {
        'icon' : '🚀'
      });
      
      const embedStatus = await embedAndIndexDocumentsToPincone(pdfFile);
      if (embedStatus === true){
        toast.success("File embedded and indexed successfully");
      } else {
        toast.error("File embedding and indexing failed");
      }

      isLoading = false;

      await setTimeout(() => {
          showUploadDropdown = false;
        }, 1000);
    }
</script>

<Toaster position="top-right" reverseOrder={false} />

<div class="space-y-4 py-1" transition:slide={{ duration: 500 }}>
    <div class="upload-container">
        <input 
          type="file" 
          accept="application/pdf" 
          bind:files={pdfFiles}
        >
    </div>

    <button 
        type="button" 
        class="btn btn-sm variant-filled space-x-2"
        disabled={!pdfFiles}
        on:click={() => handleFileUpload(pdfFiles)}
      >

      {#if isLoading} <Loader /> {/if}
      <p>Upload</p>  

    </button>
</div>

<style>
    .upload-container {
      padding: 0.85rem;
      border: 1px dashed #ccc;
      margin-top: 20px;
      cursor: pointer;
      background-color: white;
    }
  </style>