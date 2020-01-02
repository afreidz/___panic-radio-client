<section>
  <button class:disabled={vote !== null} on:click={like} class="like">🤘</button>
  <button class:disabled={vote !== null} on:click={dislike} class="dislike">💩</button>
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
  export let vote = null;

  function like(){}
  function dislike(){}
</script>