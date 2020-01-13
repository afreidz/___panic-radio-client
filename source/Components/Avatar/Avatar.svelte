<div class="avatarcontainer">
  <div 
    class="avatar"
    title={user.name}
    on:click={e => { if(!editing) click(e) }} 
  >
  {#if editing}
    {#if newphoto}
    <img src={newphoto} alt="New Avatar photo from {user.name}"/>
    {:else}
    <video autoplay bind:this={camera}/>
    {/if}
  {:else}
    {#if showphoto}
    <img src={newphoto || user.photo || defualtphoto} alt="Avatar for {user.name}"/>
    {/if}
    {#if !!showvote && !!vote}
    <em>{#if vote === 'like'}🤘{:else if vote === 'dislike'}💩{/if}</em>
    {/if}
  {/if}
  </div>
  {#if editing}
  {#if newphoto}
  <button class="editaction clear" on:click={clear}>❌</button>
  {:else}
  <button class="editaction photo" on:click={takepic}>📸</button>
  {/if}
  <button class="editaction done" on:click={done}>👍</button>
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
    img, video {
      width: 101%;
      height: 101%;
      top: -0.5%;
      left: -0.5%;
      position: relative;
      pointer-events: none;
    }
  }

  .editaction {
    position: absolute;
    border: none;
    background: none;
    outline: none;
    font-size: 1rem;
    padding: 0;
    margin: 0;
    line-height: 1rem;
    &.photo { left: unit(-30px/@one-rem, rem); bottom: 0; }
    &.done { right: unit(-30px/@one-rem, rem); bottom: 0; }
    &.clear { right: unit(-30px/@one-rem, rem); top: 0; }
  }
</style>

<script>
  import { votes } from './Store';
  import { onDestroy } from 'svelte';
  import modal from 'Components/Modal/Store';
  import { createEventDispatcher } from 'svelte';

  const cameraicon = './assets/camera.svg';
  const systemphoto = './assets/emoji.svg';
  const dispatch = createEventDispatcher();
  const defualtphoto = './assets/defaultavatar.svg';
  const supports = navigator.mediaDevices.getSupportedConstraints();
  const videoConstraints = { width: 200, height: 200, resizeMode: 'crop-and-scale' };

  export let user = {};
  export let editing = false;
  export let showvote = true; 
  export let showphoto = true;
  export let click = () => {};
  
  let vote;
  let camera;
  let stream;
  let newphoto;

  $: if(!user) user = {};
  $: if(user === 'system') user = { name: 'PanicRadio', photo: systemphoto, id: Infinity };
  $: vote = $votes.find(v => v.listener === user.id)
    ? $votes.find(v => v.listener === user.id).vote
    : null;

  $: if(editing) enablecam();
  $: if(!editing) disablecam();

  onDestroy(disablecam);

  async function enablecam(){
    try {
      stream = await (navigator
      .mediaDevices
      .getUserMedia({
        audio: false,
        video: { ...videoConstraints, facingMode: { exact: 'user'} },
      })).catch(async err => {
        return stream = await (navigator.mediaDevices.getUserMedia({
          audio: false,
          video: videoConstraints,
        }));
        camera.srcObject = stream;
      });
      camera.srcObject = stream;
    }catch(err){
      console.warn(err);
      modal.update(modal => {
        modal.content = 'The camera is not available';
        modal.title = '☠️ Error!';
        modal.theme= 'error';
        modal.action = null;
        modal.open = true;
        return modal;
      });
      done();
    }
  }

  function disablecam(){
    if(stream) stream.getTracks().forEach(t => t.stop());
    if(camera) camera.src = null;
  }

  function takepic(){
    let canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    canvas.getContext('2d').drawImage(camera, 0, 0, canvas.width, canvas.height)
    newphoto = canvas.toDataURL();
  }

  function clear(){
    newphoto = null;
    enablecam();
  }

  function done() {
    editing = false;
    dispatch('editdone', { newphoto });
  }
</script>