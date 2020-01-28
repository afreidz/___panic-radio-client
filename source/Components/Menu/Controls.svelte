<script>
  import { pinned } from './Store';
  import { openviews } from 'App/Store';
  import { muted } from 'Components/Track/Store';
  import { listenerdetails } from 'Components/Listeners/Store';
  
  export let area = null;

  function profile() {
    $listenerdetails = 'me';
    openviews.add('listenerdetails');
  }

  function mute() {
    $muted = !$muted;
  }

  function crate() {
    openviews.add('crate');
  }
</script>

<ul style="grid-area: {area}">

  {#if $pinned.has('mute')}
    <li class="control" on:click={mute}>
      <button title={$muted ? 'unmute' : 'mute'}>
        <em>{$muted ? '🔇' : '🔊'}</em>
      </button>
    </li>
  {/if}

  {#if $pinned.has('crate')}
    <li class="control" on:click={crate}>
      <button title="Crate">
        <em>📦</em>
      </button>
    </li>
  {/if}

  {#if $pinned.has('me')}
    <li class="control" on:click={profile}>
      <button title="Crate">
        <em>😃</em>
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
    margin-top: 30vh;
    right: 0;
    width: 1rem;
    flex-direction: column;
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
      font-size: unit(16px / @one-rem, rem);
      height: 2rem;
      width: 2rem;

      em {
        font-size: 0.8rem;
      }

      em.hascomponent {
        margin-right: 0;
        font-size: unit(16px / @one-rem, rem);
      }
    }
  }
</style>
