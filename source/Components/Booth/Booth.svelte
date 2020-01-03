<ul style="grid-area: {area}">
  {#each ids as dj, i}
  <li>
    <PanicAvatar 
      user={dj} 
      showphoto={!!dj}
      click={handleclick}
    />
  </li>
  {/each}
</ul>

<style lang="less">
  @import 'source/Styles/index';

  ul {
    width: 100%;
    height: 2rem;
    background: @booth-background;
    display: flex;
    justify-content: space-around;
    align-items: center;
    li { 
      width: 1rem;
      height: 1rem;
    }
  }
</style>

<script>
  import { djs } from './Store';
  import { socket, room, username, photo } from 'App/Store';
  import PanicAvatar from 'Components/Avatar/Avatar';

  export let area = null;

  let ids = [];


  $: if($djs.length > 5) ids = $djs.slice(0,5);
  $: if($djs.length < 5) ids = Array(5).fill(null).map((_,i) => $djs[i]);
  
  function handleclick(e){
    $socket.sendhost({ type: 'dj' });
  }
</script>