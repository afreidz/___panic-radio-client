<article class:active={!!isActive}>
  <div class="front">
    <figure>
      <PanicAvatar user={track.dj} showvote={false} />
    </figure>
  </div>
  <div class="back">
    <figure>
      <PanicAvatar user={track.dj} showvote={false} />
    </figure>
    <caption>
      <em>{track.title}</em>
      <strong>{track.artist}</strong>
    </caption>
    {#if !!elevator}
      <PanicElevator/>
    {/if}
  </div>
  <audio bind:this={audio} data-src={src} muted={$muted} />
</article>
 

<style lang="less">
  @import 'source/Styles/index.less';

  @keyframes flash {
    0% {
      opacity:0;
      transform: rotateY(-180deg);
    }
    100% {
      opacity:1;
      transform: rotateY(+180deg); 
    }
  }
  
  article{
    position: relative;
    width: 100%;
    height: 100%;
    max-width: unit(340px/@one-rem, rem);
    max-height: unit(500px/@one-rem, rem);

    transform-style: preserve-3d;
    transition: transform 400ms ease-in-out;
    animation: flash 0.01s;

    &.active {
      transform: rotateY(180deg);
    }
  }

  .front, .back {
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    backface-visibility: hidden;
    border-radius: @track-radius;
    background: @track-alt-1-bg;
    color: @track-alt-1-color;
    box-shadow: @track-shadow;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .front { 
    z-index: 2; 
    transform: rotateY(0deg);
  }
  .back { transform: rotateY(180deg); }

  figure {
    width: 4rem;
  }
  caption {
    em, strong { display: block; }
  }
</style>

<script>
  import { room } from 'App/Store';
  import PanicElevator from './Elevator';
  import PanicAvatar from 'Components/Avatar/Avatar';
  import { PANIC_RADIO_HOST_ENDPOINT } from 'Config';
  import { muted, current, elevator as downsrc } from './Store';

  let isActive;
  let audio;
  let src;

  $: {
    if(!!active && !!audio){
      new Promise(r => setTimeout(r, 500)).then(() => isActive = true);
      $current = audio;
    }else {
      isActive = false;
    }
  };
  
  $: src = !!elevator
    ? $downsrc
    : `${PANIC_RADIO_HOST_ENDPOINT}/${$room}/${track.id}.mp3`;
  
  $: if(!!elevator && !!$downsrc && !!audio) {
    audio.src = $downsrc;
    audio.play();
  }
  
  export let track = {};
  export let active = false;
  export let elevator = false;
</script>