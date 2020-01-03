<div class="avatarcontainer">
  <div 
    class="avatar {user.name || ''}"
    on:click={e => click(e)} 
    title={user.name}
  >
    {#if showphoto}
    <img 
      src={user.photo || defaultuserimg} 
      alt="Avatar for {user.name}"
    />
    {/if}
  </div>
  {#if !!showvote && !!vote}
  <em>
    {#if vote === 'like'}🤘{:else if vote === 'dislike'}💩{/if}
  </em>
  {/if}
</div>

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
  }
</style>

<script>
  import defaultuserimg from 'Utilities/defaultuserimg';
  const systemphoto = './assets/emoji.svg';

  export let user = {};
  export let vote = null;
  export let showvote = true;
  export let showphoto = true;
  export let click = () => {};

  $: if(user === 'system') user = { name: 'PanicRadio', photo: systemphoto, id: Infinity };
  $: if(!user) user = {};
</script>