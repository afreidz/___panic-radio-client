<aside style="grid-area: {area};">
  <small>{$room} Listeners</small>
  <ul>
    {#each $listeners as listener}
    <li><PanicAvatar user={listener} /></li>
    {/each}
  </ul>
</aside>

<style lang="less">
  @import 'source/Styles/index';

  aside {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  small {
    font-size: unit(14px/@one-rem, rem);
    font-weight: 400;
    display: block;
    text-transform: capitalize;
    text-indent: 0.5rem;
    text-align: left;
    line-height: 2;
  }

  ul {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    background: @menu-bg;
    border-top: @menu-item-border;
    li {
      flex-grow: 0;
      flex-shrink: 0;
      height: 1.5rem;
      width: 1.5rem;
      display: flex;
      margin: 0.3rem;
    }
  }
</style>

<script>
  import { room } from 'App/Store';
  import { listeners } from './Store';
  import PanicAvatar from 'Components/Avatar/Avatar';

  export let area = null;
</script>