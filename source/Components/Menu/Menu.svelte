<nav class="menu" class:open={!!$open} style="grid-area: {area}">
  <ul>
    <li>
      <button class="menuitem" on:click={() => !!$currentuser ? dispatch('logout') : dispatch('login')}>
        {#if !!$currentuser}
        <em class="hascomponent">
          <PanicAvatar user={$currentuser.id}/>
        </em>
        {:else}
        <em>🔑</em>
        {/if}
        <span>
          {#if !!$currentuser} Logout ({$currentuser.username}) {:else} Login {/if}
        </span>
      </button>
      {#if $pinned.has('login')}
      <button class="pin" on:click={() => pinned.delete('login')}>✖️</button>
      {:else}
      <button class="pin" on:click={() => pinned.add('login')}>📌</button>
      {/if}
    </li>
    <li>
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
    {#if !!$currentuser}
    <li>
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
    {/if}
  </ul>
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
    &.open {
      transform: translateX(0);
    }

    li {
      display: flex;
      border-bottom: @menu-item-border;
      justify-content: stretch;
      align-items: center;
    }
    .pin {
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
</style>

<script>
  import { pinned, open } from './Store';
  import { currentuser } from 'App/Store';
  import { muted } from 'Components/Audio/Store';
  import { createEventDispatcher } from 'svelte';
  import PanicAvatar from 'Components/Avatar/Avatar';

  const dispatch = createEventDispatcher();
  
  export let area = null;
</script>