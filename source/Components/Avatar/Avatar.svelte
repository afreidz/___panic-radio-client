<div class="avatarcontainer">
  <div 
    class="avatar {user.name || ''}"
    on:click={e => click(e)} 
    title={user.name}
  >
    {#if showphoto}
    <img 
      src={user.photo || defualtphoto} 
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
    bottom: unit(-5px/@one-rem, rem);
    right: unit(-5px/@one-rem, rem);
    text-shadow: @vote-shadow;
  }

  .avatar {
    border-radius: 50%;
    background: @avatar-bg;
    box-shadow: @avatar-shadow;
    overflow: hidden;
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    img {
      width: 101%;
      height: 101%;
      top: -0.5%;
      left: -0.5%;
      position: relative;
    }
  }
</style>

<script>
  import { votes } from './Store';
  const systemphoto = './assets/emoji.svg';
  const defualtphoto = './assets/defaultavatar.svg';
  let vote;

  export let user = {};
  export let showvote = true;
  export let showphoto = true;
  export let click = () => {};

  $: if(!user) user = {};
  $: if(user === 'system') user = { name: 'PanicRadio', photo: systemphoto, id: Infinity };
  $: vote = $votes.find(v => v.listener === user.id)
    ? $votes.find(v => v.listener === user.id).vote
    : null;
</script>