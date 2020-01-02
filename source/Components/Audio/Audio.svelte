<article class="track" style="grid-area: {area};">
  <h2>{$room}</h2>
  <figure><PanicAvatar user="system" /></figure>
  <header>
    <span>{@html nowplaying.title || 'Nothing'}</span>
    <em>{@html nowplaying.artist || 'Nobody'}</em>
  </header>
  <PanicProgress time={Infinity} run={true} start={0}/>
  <div class="timer">
    {#if nowplaying.duration}
    <pre>{time(nowplaying.elapsed)}</pre>
    <pre>{time(nowplaying.duration)}</pre>
    {/if}
  </div>
  <footer>
    {#if !!voting}
    <PanicVote/>
    {:else}
    <PanicElevator/>
    {/if}
  </footer>
</article>

<audio 
  style="grid-area: {area}"
  bind:this={audiotag}
  src={nowplaying.src}
  autoplay={true}
  on:play={play}
  muted={$muted}
/>

<style lang="less">
  @import 'source/Styles/index';
  @padding: unit(30px/@one-rem, rem);

  article.track {
    width: 100%;
    height: 100%;
    max-height: unit(500px/@one-rem, rem);
    max-width: unit(400px/@one-rem, rem);
    border-radius: @track-radius;
    box-shadow: @track-shadow;
    background: @track-alt-1-bg;
    color: @track-alt-1-color;
    display: flex;
    flex-direction: column;
  }

  h2 {
    text-transform: capitalize;
    margin: @padding auto 0 auto;
    font-weight: 800;
    font-size: 1.2rem;
    text-align: center;
  }

  figure {
    width: 3rem;
    height: 3rem;
    margin: @padding/2 auto 0 auto;
  }

  header {
    margin: @padding auto;
    text-align: center;
    span { 
      display: block; 
      font-size: unit(20px/@one-rem, rem);
      margin: unit(15px/@one-rem, rem) 0;
    }
    em { 
      display: block; 
      font-size: unit(14px/@one-rem, rem);
      opacity: 0.3;
      margin: unit(15px/@one-rem, rem) 0;
    }
  }

  .timer {
    display: flex;
    justify-content: space-between;
    padding: unit(20px/@one-rem, rem);
  }

  pre {
    font-size: unit(12px/@one-rem, rem);
    font-weight: 400;
    font-family: 'Space Mono', monospace;
  }
</style>

<script>
  import moment from 'moment';
  import { room, socket } from 'App/Store';
  import PanicVote from 'Components/Audio/Vote.svelte';
  import PanicAvatar from 'Components/Avatar/Avatar.svelte';
  import PanicProgress from 'Components/Audio/Progress.svelte';
  import PanicElevator from 'Components/Audio/Elevator.svelte';
  import { tracks, audio, muted, elevator, current } from './Store';
  
  export let area = null;
  
  let nowplaying = { src: $elevator };
  let streamlength = 0;
  let timestamp = 0;
  let voting = false;
  let audiotag;
  let timer;

  $: if(audiotag) $audio = audiotag;
  $: if($tracks[0]) nowplaying = $tracks[0];

  function play(){
    if(nowplaying.src === $elevator || !!nowplaying.played) return;
    nowplaying.played = true;
    audiotag.addEventListener('timeupdate', tracktime);
    streamlength += nowplaying.remaining;
    timer = setInterval(() => nowplaying.elapsed+=1000, 1000);
    console.info('Playing', nowplaying.title, 'Remaining:', time(nowplaying.remaining), 'Current Stream Length', time(streamlength));
  }

  function tracktime(e){
    timestamp = e.target.currentTime * 1000;
    if(streamlength > 0 && timestamp >= (streamlength - 1000)){
      console.info('Ended', nowplaying.title, time(streamlength));
      tracks.set($tracks.slice(1));
      clearTimeout(timer);
      audiotag.removeEventListener('timeupdate', tracktime);
      nowplaying = $tracks[0] || { src: $elevator };
      play();
    }
  }

  function time(ms){
    return moment().startOf('day').seconds(ms/1000).format('HH:mm:ss');
  }
</script>