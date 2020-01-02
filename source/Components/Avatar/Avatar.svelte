{#await loading}
<Loader/>
{:then record}
<div class="avatarcontainer">
  <div 
    class="avatar {record.username || ''}"
    class:hasuser={!!record.id} 
    on:click={e => click(e)} 
    title={record.username}
  >
    {#if showphoto}
    <img 
      src={record.photo || defaultuserimg} 
      alt="Avatar for {record.username}"
    />
    {/if}
  </div>
  {#if !!showvote}
  <em>
    {#if vote === 'like'}🤘{:else if vote === 'dislike'}💩{/if}
  </em>
  {/if}
</div>
{/await}

<style lang="less">
  @import 'source/Styles/index';

  .avatarcontainer {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
  }

  em {
    position: absolute;
    font-size: 0.5rem;
    bottom: 0; right: 0;
  }

  .avatar {
    border-radius: 50%;
    border: @avatar-border;
    background: rgba(0,0,0,0.2);
    overflow: hidden;
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    img {
      width: 120%;
      height: 120%;
      top: -10%;
      left: -10%;
      position: relative;
    }
    &.hasuser {
      background: @avatar-bg;
    }
  }
</style>

<script>
  import Loader from 'Assets/loader';
  import getuser from 'Utilities/getuser';
  import defaultuserimg from 'Utilities/defaultuserimg';

  let loading;
  let vote = null;
  let systemphoto = './assets/emoji.svg';  
  export let user = null;
  export let state = null;
  export let showvote = true;
  export let showphoto = true;
  export let click = () => {};

  $: if(user === null) loading = Promise.resolve({});
  $: if(user === 'system') loading = Promise.resolve({ username: 'PanicRadio', photo: systemphoto, id: Infinity });
  $: if(!!user && user !== 'system') {
    // if(user == 1571085708811) throw new Error('weirdness');
    loading = getuser(user);
  }
</script>