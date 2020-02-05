<script>
  import { pinned, open } from './Store';
  import { muted } from 'Components/Track/Store';
  import PanicProTip from 'Components/ProTip/Tip';
  import PanicHolder from 'Components/Button/Holder';
  import { openviews, anonymous, username } from 'App/Store';
  import { listenerdetails } from 'Components/Listeners/Store';

  let pinmode = false;

  function profile() {
    $open = false;
    $listenerdetails = 'me';
    openviews.add('listenerdetails');
  }

  function mute() {
    muted.set(!$muted);
  }

  function crate() {
    $open = false;
    openviews.add('crate');
  }

  function goanon() {
    anonymous.set(!$anonymous);
  }
</script>

<nav class="menu" class:pinmode>
  <button
    class="close"
    on:click={() => {
      $open = false;
    }}>
    ✕
  </button>
  <ul>
    <li>
      <PanicHolder
        on:hold={() => {
          pinmode = true;
        }}
        on:default={mute}>
        <div class="menuitem">
          <em>{$muted ? '🔇' : '🔊'}</em>
          <span>{$muted ? 'Unmute' : 'Mute'}</span>
        </div>
      </PanicHolder>
      {#if $pinned.has('mute')}
        <button class="pin" on:click={() => pinned.delete('mute')}>✖️</button>
      {:else}
        <button class="pin" on:click={() => pinned.add('mute')}>📌</button>
      {/if}
    </li>
    <li>
      <PanicHolder
        on:hold={() => {
          pinmode = true;
        }}
        on:default={crate}>
        <div class="menuitem">
          <em>📦</em>
          <span>Crate</span>
        </div>
      </PanicHolder>
      {#if $pinned.has('crate')}
        <button class="pin" on:click={() => pinned.delete('crate')}>✖️</button>
      {:else}
        <button class="pin" on:click={() => pinned.add('crate')}>📌</button>
      {/if}
    </li>
    <li>
      <PanicHolder
        on:hold={() => {
          pinmode = true;
        }}
        on:default={profile}>
        <div class="menuitem">
          <em>😃</em>
          <span>Profile</span>
        </div>
      </PanicHolder>
      {#if $pinned.has('me')}
        <button class="pin" on:click={() => pinned.delete('me')}>✖️</button>
      {:else}
        <button class="pin" on:click={() => pinned.add('me')}>📌</button>
      {/if}
    </li>
    <li>
      <PanicHolder
        on:hold={() => {
          pinmode = true;
        }}
        on:default={goanon}>
        <div class="menuitem">
          <em>{$anonymous ? '👻' : '👤'}</em>
          <span>{$anonymous ? 'Anonymous' : `Known as ${$username}`}</span>
        </div>
      </PanicHolder>
    </li>
    {#if !!pinmode}
      <li class="done">
        <button
          on:click={() => {
            pinmode = false;
          }}>
          👍
        </button>
      </li>
    {/if}
  </ul>
  <PanicProTip
    tip={'Click and hold a menu item to enable "pin mode" to add menu items to the control sidebar'} />
</nav>

<style lang="less">
  @import 'source/Styles/index';

  .menu {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .close {
      border: none;
      background: none;
      outline: none;
      font-size: 1rem;
      color: @view-color;
      background: rgba(0, 0, 0, 0.3);
      height: 2rem;
      width: 2rem;
      flex-grow: 0;
      flex-shrink: 0;
    }

    &.pinmode .pin {
      display: initial;
    }

    ul {
      flex-grow: 1;
      flex-shrink: 0;
      background: rgba(0, 0, 0, 0.3);
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
          border: none;
          outline: none;
          padding: none;
          background: none;
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
      font-size: unit(16px / @one-rem, rem);
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
        padding: unit(12px / @one-rem, rem);
        margin-right: 2rem - @menu-item-height;
      }
    }
    span {
      line-height: @menu-item-height;
    }
  }
</style>
