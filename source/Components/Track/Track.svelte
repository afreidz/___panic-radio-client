<script>
  import PanicProgress from './Progress';
  import { createEventDispatcher } from 'svelte';
  // import PanicVote from 'Components/Track/Vote';
  import PanicAvatar from 'Components/Avatar/Avatar';
  import { PANIC_RADIO_HOST_ENDPOINT } from 'Config';

  export let track = {};
  export let member = {};
  export let muted = true;
  export let active = false;
  export let voting = false;

  const dispatch = createEventDispatcher();

  let audio;
  let src;

  function end() {
    active = false;
    dispatch('end');
  }

  $: src = `${PANIC_RADIO_HOST_ENDPOINT}/${track.room}/${track.id}.mp3`;
  $: if (active && audio) audio.play();
</script>

<svelte:options accessors={true} />

<article class:active>
  <div class="front">
    <figure>
      <PanicAvatar user={member} showvote={false} />
    </figure>
  </div>
  <div class="back">
    <figure>
      <PanicAvatar user={member} showvote={false} />
    </figure>
    <caption>
      <em>{track.title}</em>
      <strong>{track.artist}</strong>
      <PanicProgress start={track.elapsed} duration={track.duration} />
    </caption>
    <div class="actions">
      <!-- {#if voting}
        <PanicVote />
      {/if} -->
    </div>
  </div>
  {#if active}
    <audio bind:this={audio} {src} {muted} on:ended={end} />
  {/if}
</article>

<style lang="less">
  @import 'source/Styles/index.less';

  @keyframes flash {
    0% {
      opacity: 0;
      transform: rotateY(-180deg);
    }
    100% {
      opacity: 1;
      transform: rotateY(+180deg);
    }
  }

  article {
    position: relative;
    width: 100%;
    height: 100%;
    max-width: unit(340px / @one-rem, rem);
    max-height: unit(500px / @one-rem, rem);
    transform-style: preserve-3d;
    transition: transform 400ms ease-in-out;
    animation: flash 0.01s;

    &.active {
      transform: rotateY(180deg);
    }
  }

  .front,
  .back {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    backface-visibility: hidden;
    border-radius: @track-radius;
    background: @track-alt-1-bg;
    color: @track-alt-1-color;
    box-shadow: @track-shadow;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .front {
    z-index: 2;
    transform: rotateY(0deg);
    display: grid;
    grid-template-rows: auto;
    grid-template-areas: 'avatar';
  }
  .back {
    transform: rotateY(180deg);
    display: grid;
    grid-template-rows: 7rem auto 5rem;
    grid-template-areas: 'avatar' 'details' 'actions';
  }

  figure {
    width: 4rem;
    grid-area: avatar;
    justify-self: center;
  }
  caption {
    grid-area: details;
    em,
    strong {
      display: block;
    }
    em {
      font-family: 'Montserrat';
      font-size: unit(16px / @one-rem, rem);
      font-weight: 900;
      line-height: 1.2;
    }
    strong {
      font-size: unit(12px / @one-rem, rem);
      font-weight: 400;
      opacity: 0.6;
    }
  }
  .actions {
    grid-area: actions;
    align-self: end;
  }
</style>
