<ul class="{controlslocation}">

  {#if [...$pinned].length}
  <li class="control">
    <button class="mover" on:click={rotatecontrolslocation}>
      <em>🔄</em>
    </button>
  </li>
  {/if}
  
  {#if $pinned.has('login')}
  <li class="control">
     <button title="{!!$currentuser ? 'logout' : 'login'}" on:click={() => !!$currentuser ? dispatch('logout') : dispatch('login')}>
      <em>🔑</em>
     </button>
  </li>
  {/if}

  {#if $pinned.has('mute')}
  <li class="control" on:click={() => $muted = !$muted}>
     <button title="{!!$muted ? 'unmute' : 'mute'}">
      <em>{ !!$muted ? '🔇' : '🔊'}</em>
     </button>
  </li>
  {/if}

  {#if $pinned.has('crate') && !!$currentuser}
  <li class="control" on:click={() => dispatch('crate')}>
     <button title="Crate">
      <em>📦</em>
     </button>
  </li>
  {/if}
</ul>

<style lang="less">
  @import 'source/Styles/index';

  ul {
    position: fixed;
    display: flex;
    place-items: center;
    z-index: 1;
    transform: scale(0.6);
    justify-content: center;

    &.north {
      top: 0px;
      width: 100%;
      transform-origin: top center;
    }

    &.south {
      bottom: 0px;
      width: 100%;
      transform-origin: bottom center;
    }

    &.east {
      margin-top: 30vh;
      right: 0px;
      width: 1rem;
      flex-direction: column;
    }

    &.west {
      margin-top: 30vh;
      left: 0px;
      width: 1rem;
      flex-direction: column;
    }
  }

  .control {
    button {
      cursor: pointer;
      outline: none;
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      font-size: unit(16px/@one-rem, rem);
      height: 2rem;
      width: 2rem;

      em {
        font-size: 0.8rem;
      }

      em.hascomponent {
        margin-right: 0;
        font-size: unit(16px/@one-rem, rem);
      }
    }
  }
</style>

<script>
  import { pinned } from './Store';
  import { currentuser } from 'App/Store';
  import { createEventDispatcher } from 'svelte';
  import { muted } from 'Components/Audio/Store';
  import PanicAvatar from 'Components/Avatar/Avatar';

  export let area = null;
  let dispatch = createEventDispatcher();
  let controlslocation = 'north';

  function rotatecontrolslocation(){
    switch (controlslocation){
      case 'north':
        controlslocation = 'south';
        break;
      case 'south':
        controlslocation = 'east';
        break;
      case 'east':
        controlslocation = 'west';
        break;
      case 'west':
        controlslocation = 'north';
        break;
      default:
        controlslocation = 'north';
        break;
    }
  }
</script>