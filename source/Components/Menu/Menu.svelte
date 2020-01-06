<nav class="menu" class:pinmode={pinmode} class:open={!!$open} style="grid-area: {area}">
  <ul>
    <li
      on:mouseup={endhold}
      on:touchend={endhold}
      on:mousedown={starthold}
      on:touchstart={starthold}
    >
      <button class="menuitem" on:click={() => ($muted = !$muted)}>
        <em>{ !!$muted ? '🔇' : '🔊'}</em>
        <span>{ !!$muted ? 'Unmute' : 'Mute' }</span>
      </button>
      {#if $pinned.has('mute')}
      <button class="pin" on:click={() => pinned.delete('mute')}>✖️</button>
      {:else}
      <button class="pin" on:click={() => pinned.add('mute')}>📌</button>
      {/if}
    </li>
    <li
      on:mouseup={endhold}
      on:touchend={endhold}
      on:mousedown={starthold}
      on:touchstart={starthold}
    >
      <button class="menuitem" on:click={() => dispatch('crate')}>
        <em>📦</em>
        <span>Crate</span>
      </button>
      {#if $pinned.has('crate')}
      <button class="pin" on:click={() => pinned.delete('crate')}>✖️</button>
      {:else}
      <button class="pin" on:click={() => pinned.add('crate')}>📌</button>
      {/if}
    </li>
    {#if !!pinmode}
    <li class="done">
      <button on:click={() => pinmode = false}>👍</button>
    </li>
    {/if}
  </ul>
  <div class="tip">
    <PanicProTip tip={"Click and hold a menu item to enable \"pin mode\" to add menu items to the control sidebar"}/>
  </div>
</nav>

<style lang="less">
  @import 'source/Styles/index';

  .menu {
    background: @menu-bg;
    z-index: 2;
    transition: transform 300ms ease-out;
    transform: translateX(-100%);
    position: absolute;
    top: 2rem; bottom: 0;
    left: 0; right: 0;
    max-width: unit(600px/@one-rem, rem);
    display: flex;
    flex-direction: column;

    &.pinmode .pin {
      display: initial;
    }

    &.open {
      transform: translateX(0);
    }

    ul {
      flex-grow: 1;
    }

    li {
      display: flex;
      border-bottom: @menu-item-border;
      justify-content: stretch;
      align-items: center;

      &.done {
        justify-content: flex-end;
        border-bottom: none;
        button { 
          font-size: 0.75rem; 
          margin-top: 0.25rem;
        }
      }
    }
    .pin {
      display: none;
      border: none;
      background: none;
      font-size: 0.5rem;
      outline: none;
    }
    .menuitem {
      display: flex;
      color: @menu-color;
      background: none;
      border: none;
      height: @menu-item-height;
      outline: none;
      font-size: unit(16px/@one-rem, rem);
      flex-grow: 1;
      margin: 0;
      padding: 0;
      cursor: pointer;
      text-align: left;
    }

    em {
      width: 2rem;
      height: @menu-item-height;
      display: inline-grid;
      place-items: center;
      &.hascomponent { 
        width: @menu-item-height;
        padding: unit(12px/@one-rem, rem);
        margin-right: 2rem - @menu-item-height;
      }
    }
    span { 
      line-height: @menu-item-height;
    }
  }

  .tip {
    justify-self: flex-end;
  }
</style>

<script>
  import { pinned, open } from './Store';
  import { createEventDispatcher } from 'svelte';
  import { muted } from 'Components/Track/Store';
  import PanicProTip from 'Components/ProTip/Tip';
  import PanicAvatar from 'Components/Avatar/Avatar';

  const dispatch = createEventDispatcher();
  let pinmode = false;
  let pintimer;

  function starthold(e){
    if(!!pinmode) return true;
    pintimer = setTimeout(() => {
      pintimer = null;
      pinmode = true;
    }, 400);
  }

  function endhold(){
    if(!pintimer) return true;
    pinmode = false;
    clearTimeout(pintimer);
  }
  
  export let area = null;
</script>