<ul style="grid-area: {area}">
  {#each ids as dj, i}
  <li>
    <PanicAvatar 
      user={dj} 
      showphoto={!!dj}
      click={() => handleclick(dj)}
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
  import modal from 'Components/Modal/Store';
  import { items } from 'Components/Crate/Store';
  import { me } from 'Components/Listeners/Store';
  import { djs, request, autoplay } from './Store';
  import { socket, room, username, photo } from 'App/Store';
  import PanicAvatar from 'Components/Avatar/Avatar';

  export let area = null;

  let ids = [];

  $: if($djs.length > 5) ids = $djs.slice(0,5);
  $: if($djs.length < 5) ids = Array(5).fill(null).map((_,i) => $djs[i]);
  $: if($request === true && $items[0] && $autoplay) request.respond($items.shift());
  $: if($request === false) $socket.sendhost({ type: 'leave' });
  
  function handleclick(dj = {}){
    if(!$djs.map(d=>d.id).includes($me.id)) return $socket.sendhost({ type: 'dj' });
    if(dj.id === $me.id) {
      modal.update(m => {
        m.content = 'Do you want to leave the DJ booth?';
        m.title = 'Leave the DJ Booth?';
        m.action = () => $socket.sendhost({ type: 'leave' });
        m.label = 'yes';
        m.open = true;
        return m;
      });
    }
  }
</script>