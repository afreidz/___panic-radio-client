<script>
  import { preview } from './Store';
  import { PANIC_RADIO_HOST_ENDPOINT } from '../../../config';

  let video;

  $: if (video) video.addEventListener('loadedmetadata', video.requestPictureInPicture);
  $: console.log('Preview', `${PANIC_RADIO_HOST_ENDPOINT}/preview/${$preview}`);
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
</style>
