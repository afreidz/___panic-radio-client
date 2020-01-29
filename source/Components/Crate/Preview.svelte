<script>
  import { preview } from './Store';
  import { get } from 'svelte/store';
  import { muted } from 'Components/Track/Store';
  import { PANIC_RADIO_HOST_ENDPOINT } from '../../../config';

  let video;

  async function launchpreview() {
    const mutedstate = get(muted);
    $muted = true;
    await video.requestPictureInPicture();
    video.addEventListener('leavepictureinpicture', () => {
      $preview = null;
      $muted = mutedstate;
    });
  }

  $: if (video) video.addEventListener('loadedmetadata', launchpreview);
</script>

{#if !!$preview}
  <video
    controls
    class="player"
    autoplay={true}
    bind:this={video}
    title="Song Preview"
    src={`${PANIC_RADIO_HOST_ENDPOINT}/preview/${$preview}`} />
{/if}

<style lang="less">
  @import 'source/Styles/index';
  .player {
    width: 0;
    height: 0;
    visibility: hidden;
  }
</style>
