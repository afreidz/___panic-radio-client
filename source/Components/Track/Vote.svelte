<script>
  import modal from 'Components/Modal/Store';
  import { socket } from 'App/Store';
  
  export let voted = false;

  function warn() {
    modal.update((modalstate) => {
      const m = modalstate;
      m.content = 'Do you want to remove this vote and change it?';
      m.title = 'You have already voted!';
      m.action = () => { voted = false; };
      m.label = 'yes';
      m.open = true;
      return m;
    });
  }

  function like() {
    if (voted) return warn();
    $socket.sendhost({ type: 'vote', vote: 'like' });
    voted = true;
    return true;
  }
  function dislike() {
    if (voted) return warn();
    $socket.sendhost({ type: 'vote', vote: 'dislike' });
    voted = true;
    return true;
  }
</script>

<section>
  <button class:disabled={voted !== false} on:click={like} class="like">
    🤘
  </button>
  <button class:disabled={voted !== false} on:click={dislike} class="dislike">
    💩
  </button>
</section>

<style lang="less">
  @import 'source/Styles/index';

  section {
    border-top: 2px solid @track-border-color;
    display: flex;
    button {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      text-align: center;
      line-height: 2.5rem;
      font-size: 1rem;
      &:first-child {
        border-right: 2px solid @track-border-color;
      }
      &.disabled {
        opacity: 0.2;
      }
    }
  }
</style>
