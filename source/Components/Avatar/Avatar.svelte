<script>
  import PanicModal from 'Components/Modal/Modal';
  import { onDestroy, createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const systemphoto = './assets/emoji.svg';
  const defualtphoto = './assets/defaultavatar.svg';
  const videoConstraints = {
    width: 200,
    height: 200,
    resizeMode: 'crop-and-scale',
  };

  export let user = {};
  export let vote = null;
  export let editing = false;
  export let showvote = true;
  export let showphoto = true;
  export let click = () => {};

  let camera;
  let stream;
  let newphoto;

  function disablecam() {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (camera) camera.src = null;
  }

  function takepic() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    canvas.getContext('2d').drawImage(camera, 0, 0, canvas.width, canvas.height);
    newphoto = canvas.toDataURL();
  }

  function done() {
    editing = false;
    dispatch('editdone', { newphoto });
  }

  onDestroy(disablecam);

  async function enablecam() {
    try {
      stream = await navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { ...videoConstraints, facingMode: { exact: 'user' } },
        })
        .catch(async () => {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: videoConstraints,
          });
          camera.srcObject = stream;
        });
      camera.srcObject = stream;
    } catch (err) {
      const modal = new PanicModal({
        intro: true,
        target: document.body,
        props: {
          open: true,
          theme: 'error',
          title: '☠️ Error!',
          content: 'The camera is not available.',
        },
      });
      modal.$on('close', () => modal.$destroy());
      done();
    }
  }

  function clear() {
    newphoto = null;
    enablecam();
  }

  $: if (!user) user = {};
  $: if (user === 'system') {
    user = { name: 'PanicRadio', photo: systemphoto, id: Infinity };
  }
  $: if (editing) enablecam();
  $: if (!editing) disablecam();
</script>

<div class="avatarcontainer">
  <div
    class="avatar"
    title={user.name}
    on:click={(e) => {
      if (!editing) click(e);
    }}>
    {#if editing}
      {#if newphoto}
        <img src={newphoto} alt="New Avatar photo from {user.name}" />
      {:else}
        <video autoplay bind:this={camera} />
      {/if}
    {:else if showphoto}
      <img src={newphoto || user.photo || defualtphoto} alt="Avatar for {user.name}" />
    {/if}
  </div>
  {#if !!showvote && !!vote && !editing}
    <em>
      {#if vote === 'like'}🤘{:else if vote === 'dislike'}💩{/if}
    </em>
  {/if}
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
    bottom: unit(-5px / @one-rem, rem);
    right: unit(-5px / @one-rem, rem);
    text-shadow: @vote-shadow;
  }

  .avatar {
    border-radius: 50%;
    background: @avatar-bg;
    box-shadow: @avatar-shadow;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    img,
    video {
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
    &.photo {
      left: unit(-30px / @one-rem, rem);
      bottom: 0;
    }
    &.done {
      right: unit(-30px / @one-rem, rem);
      bottom: 0;
    }
    &.clear {
      right: unit(-30px / @one-rem, rem);
      top: 0;
    }
  }
</style>
