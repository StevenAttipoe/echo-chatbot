<script>
    export let width = 1;
    export let height = 1;
</script>

<span 
    class="loader"
    style="width: {width}rem; height: {height}rem;"
/>


<style>
    .loader {
        border: 5px solid #FFF;
        border-bottom-color: black;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 
</style>