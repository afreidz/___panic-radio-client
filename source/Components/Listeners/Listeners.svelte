<script>
  import PanicAvatar from 'Components/Avatar/Avatar';
  import { openviews, listenerdetails } from 'App/Store';

  export let listeners = [];

  function details(listener) {
    $listenerdetails = listener;
    openviews.add('listenerdetails');
  }
</script>

<ul>
  {#each listeners as listener}
    <li>
      <PanicAvatar user={listener} click={() => details(listener)} />
    </li>
  {/each}
</ul>

<style lang="less">
  @import 'source/Styles/index';

  ul {
    width: 100%;
    height: 2rem;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    padding-left: 0.5rem;
    li {
      height: 1rem;
      width: 1rem;
      margin-right: 0.5rem;
      flex-shrink: 0;
    }
  }
</style>
