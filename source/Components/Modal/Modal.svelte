<div class="modal" class:open={$state.open} class:closed={!$state.open}>
  <div class="dialog">
    <header>
      <span>{$state.title}</span>
      <button class="close" on:click={close}>✕</button>
    </header>
    <main>
      {@html $state.content}
    </main>
    <footer>
      <PanicButton on:click={trigger}>{$state.label}</PanicButton>
    </footer>
  </div>
</div>

<style lang="less">
  @import 'source/Styles/index';

  .close {
    width: 2rem;
    border: none;
    font-size: 1rem;
    background: none;
    outline: none;
    color: @modal-alt1-color;
  }

  .modal {
    background: @modal-backdrop;
    backdrop-filter: blur(2px);
    position: fixed;
    top: 0; bottom: 0;
    left: 0; right: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3;
    &.closed { display: none; }
  }

  .dialog {
    background: @modal-bg;
    color: @modal-color;
    border-radius: @modal-radius;
    border: @modal-border;
    box-shadow: @modal-shadow;
    width: 80%;
    max-width: 18rem;
    transition: all 300ms ease-out;;
    padding: 0;
    background: @modal-alt1-bg;
    color: @modal-alt1-color;

    .closed & {
      transform: scale(0);
    }
    
    header{
      font-family: "Montserrat";
      font-weight: 900;
      font-size: unit(30px/@one-rem, rem);
      padding: unit(20px/@one-rem, rem);
      display: flex;
      justify-content: space-between;
    }
  }

  main {
    font-size: unit(20px/@one-rem, rem);
    margin-bottom: unit(20px/@one-rem, rem) 0;
    padding: unit(20px/@one-rem, rem);
  }

  footer {
    padding: unit(20px/@one-rem, rem);
  }
</style>

<script>
  import PanicButton from 'Components/Button/Button';
  import state from './Store';

  function trigger(){
    if(typeof $state.action === 'function'){
      $state.action();
    }
    close(false);
  }

  function close(cancel = true){
    state.update(s => {
      s.action = () => {};
      s.open = false;
      s.content = '';
      s.title = '';
      s.label = '';
      return s;
    });
    if(cancel && typeof $state.cancel === 'function'){
      $state.cancel();
    }
  }
</script>