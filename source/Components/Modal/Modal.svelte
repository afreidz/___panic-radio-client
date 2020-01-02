<div class="modal {stateclass}">
  <div class="dialog {altclass}" bind:this={dialog}>
    <header>
      <slot name="title"></slot>
      {#if closebtn}<button class="close" on:click={() => dispatch('close')}>✕</button>{/if}
    </header>
    <main>
      <slot name="content"></slot>
    </main>
    <footer>
      <slot name="actions"></slot>
    </footer>
  </div>
</div>

<style lang="less">
  @import 'source/Styles/index';

  .close {
    width: 2rem;
    border: none;
    font-size: 1rem;
    background: none;
    outline: none;
  }

  .modal {
    background: @modal-backdrop;
    backdrop-filter: blur(2px);
    position: fixed;
    top: 0; bottom: 0;
    left: 0; right: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    &.closed { display: none; }
  }

  .dialog {
    background: @modal-bg;
    color: @modal-color;
    border-radius: @modal-radius;
    border: @modal-border;
    box-shadow: @modal-shadow;
    width: 80%;
    max-width: 18rem;
    transition: all 300ms ease-out;;
    padding: 0;

    &.alt-1 {
      background: @modal-alt1-bg;
      color: @modal-alt1-color;
      .close { color: @modal-alt1-color; }
    }

    &.alt-2 {
      background: @modal-alt2-bg;
      color: @modal-alt2-color;
      .close { color: @modal-alt2-color; }
    }

    .closed & {
      transform: scale(0);
    }
    
    header{
      font-family: "Montserrat";
      font-weight: 900;
      font-size: unit(30px/@one-rem, rem);
      display: flex;
      justify-content: space-between;
    }
  }

  main {
    font-size: unit(20px/@one-rem, rem);
    margin-bottom: unit(20px/@one-rem, rem) 0;
  }
</style>

<script>
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  export let closebtn = true;
  export let open = false;
  export let theme = null;
  export let alt = null;
  let stateclass;
  let altclass;
  let dialog;

  let dispatch = createEventDispatcher();

  $: {
    altclass = alt ? `alt-${alt}` : '';
    stateclass = !!open ? 'opened' : 'closed';
  }
</script>