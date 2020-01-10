<section>
  <button class:disabled={voted !== false} on:click={like} class="like">🤘</button>
  <button class:disabled={voted !== false} on:click={dislike} class="dislike">💩</button>
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
      &.disabled { opacity: 0.2; }
    }
  }
</style>

<script>
  import PanicButton from 'Components/Button/Button';
  import modal from 'Components/Modal/Store';
  import { socket } from 'App/Store';
  export let voted = false;
  
  function warn(){
    modal.update(modal => {
      modal.content = 'Do you want to remove this vote and change it?';
      modal.title = 'You have already voted!';
      modal.action = () => voted = false;
      modal.label = 'yes';
      modal.open = true;
      return modal;
    });
  }

  function like(){
    if(!!voted) return warn();
    $socket.sendhost({ type: 'vote', vote: 'like' });
    voted = true;
  }
  function dislike(){
    if(!!voted) return warn();
    $socket.sendhost({ type: 'vote', vote: 'dislike' });
    voted = true;
  }
</script>