<div class="preview">
  <button class="close" on:click={() => dispatch('close')}>✕</button>
  <div class="content">
    <iframe
      class="player"
      scrolling="no" 
      autoplay={true}
      frameborder="no"
      allowtransparency="true" 
      allow="encrypted-media"
      title="Song Preview"
      src={$preview}
    ></iframe>
  </div>
</div>

<style lang="less">
  @import 'source/Styles/index';

  .preview {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 2rem auto;
    grid-template-columns: 2rem auto;
    grid-template-areas: 
      'close .'
      'main main';
  }
  .close { 
    grid-area: close; 
    border: none;
    background: none;
    outline: none;
    font-size: 1rem;
    color: @view-color;
    background: rgba(0,0,0,0.3);
  }
  .content {
    grid-area: main;
    background: rgba(0,0,0,0.3);
    display: grid;
  }
  .player {
    width: unit(300px/@one-rem, rem);
    margin: unit(20px/@one-rem, rem) auto;
    height: unit(169px/@one-rem, rem);
  }
</style>

<script>
  import { preview } from './Store';
  import { createEventDispatcher } from 'svelte';
  
  let dispatch = createEventDispatcher();
</script>