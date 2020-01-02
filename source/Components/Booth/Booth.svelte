
<article style="grid-area: {area}">
<small>{$room} DJs</small>
  <ul>
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
</article>

<style lang="less">
  @import 'source/Styles/index';

  article {
    width: 100%;
    max-width: unit(320px/@one-rem, rem);
    place-self: center;
  }

  small {
    font-size: unit(14px/@one-rem, rem);
    font-weight: 400;
    display: block;
    margin: 0 0 unit(10px/@one-rem, rem) 0;
    text-transform: capitalize;
    text-align: center;
    line-height: 3;
  }

  ul {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
    height: unit(50px/@one-rem, rem);
    li { 
      width: unit(42px/@one-rem, rem);
      height: unit(42px/@one-rem, rem);
     }
  }
</style>

<script>
  import { djs, request } from './Store';
  import PanicAvatar from 'Components/Avatar/Avatar';
  import { items as crate } from 'Components/Crate/Store';
  import { room, currentuserid, socket } from 'App/Store';

  export let area = null;

  let ids = [];

  $: if($djs.length > 5) ids = $djs.slice(0,5);
  $: if($djs.length < 5) ids = Array(5).fill(null).map((_,i) => $djs[i]);
  $request;

  function handleclick(e){
    if (!!$currentuserid && !!$socket){
      $socket.sendhost({ type: 'adddj' });
    } 
  }
</script>