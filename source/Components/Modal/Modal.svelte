{#if $state.open}
<div class="modal {$state.theme}" transition:fade={{ duration: 300 }}>
  <div class="dialog">
    <header>
      <span>{$state.title}</span>
      <button class="close" on:click={close}>✕</button>
    </header>
    <main>
      {@html $state.content}
    </main>
    {#if $state.action !== null}
    <footer>
      <PanicButton on:click={trigger}>{$state.label}</PanicButton>
    </footer>
    {/if}
  </div>
</div>
{/if}

<style lang="less">
  @import 'source/Styles/index';

  .close {
    width: 1rem;
    height: 1rem;
    border: none;
    font-size: 1rem;
    background: none;
    line-height: 1rem;
    outline: none;
    color: @modal-color;
    user-select: none;
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
  }

  .dialog {
    background: @modal-bg;
    color: @modal-color;
    border-radius: @modal-radius;
    border: @modal-border;
    box-shadow: @modal-shadow;
    width: 80%;
    max-width: 18rem;
    padding: 0;

    .error & {
      background: @modal-bg-error;
    }
    
    header{
      font-family: "Montserrat";
      font-weight: 900;
      font-size: unit(30px/@one-rem, rem);
      padding: unit(20px/@one-rem, rem);
      display: flex;
      justify-content: space-between;
      span { pointer-events: none; user-select: none; }
    }
  }

  main {
    font-size: unit(20px/@one-rem, rem);
    margin-bottom: unit(20px/@one-rem, rem) 0;
    padding: unit(20px/@one-rem, rem);
  }

  footer {
    padding: unit(20px/@one-rem, rem);
  }
</style>

<script>
  import state from './Store';
  import { fade } from 'svelte/transition';
  import PanicButton from 'Components/Button/Button';

  function trigger(){
    if(typeof $state.action === 'function'){
      $state.action();
    }
    close(false);
  }

  function close(cancel = true){
    state.update(s => {
      s.action = () => {};
      s.open = false;
      s.content = '';
      s.title = '';
      s.label = '';
      return s;
    });
    if(cancel && typeof $state.cancel === 'function'){
      $state.cancel();
    }
  }
</script>