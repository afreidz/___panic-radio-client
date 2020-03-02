<script>
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import PanicButton from 'Components/Button/Button';

  const dispatch = createEventDispatcher();

  export let title = '';
  export let content = '';
  export let label = null;
  export let theme = null;
  export let open = false;

  async function trigger() {
    dispatch('trigger');
    open = false;
    await new Promise((r) => setTimeout(r, 400));
    dispatch('close');
  }

  async function close() {
    open = false;
    await new Promise((r) => setTimeout(r, 400));
    dispatch('close');
  }
</script>

{#if open}
  <div class="modal {theme}" transition:fade={{ duration: 300 }}>
    <div class="dialog">
      <header>
        <span>{title}</span>
        <button class="close" on:click={close}>✕</button>
      </header>
      <main>
        {@html content}
      </main>
      {#if label}
        <footer>
          <PanicButton on:click={trigger}>{label}</PanicButton>
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
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
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

    header {
      font-family: 'Montserrat';
      font-weight: 900;
      font-size: unit(30px / @one-rem, rem);
      padding: unit(20px / @one-rem, rem);
      display: flex;
      justify-content: space-between;
      span {
        pointer-events: none;
        user-select: none;
      }
    }
  }

  main {
    font-size: unit(20px / @one-rem, rem);
    margin-bottom: unit(20px / @one-rem, rem) 0;
    padding: unit(20px / @one-rem, rem);
  }

  footer {
    padding: unit(20px / @one-rem, rem);
  }
</style>
