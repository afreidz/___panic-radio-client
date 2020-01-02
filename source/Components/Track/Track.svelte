<article class="track-alt-1">
  <header>
    <h2>
      <span>{track.title}</span>
      <em>{track.artist}</em>
    </h2>
    {#if track.dj}
    <figure class="dj"><PanicAvatar user={track.dj}/></figure>
    <caption class="score">🏆: {score}</caption>
    {/if}
  </header>
  <div>
    <ProgressBar time={track.length} run={playing} start={track.time || 0} />
    <pre>{elapsed}</pre>
  </div>
  <footer>
  {#if voting}
    <button class:disabled={vote !== null} on:click={like} class="like">🤘</button>
    <button class:disabled={vote !== null} on:click={dislike} class="dislike">💩</button>
  {:else}
  <label>
  <select on:change="{e => dispatch('elevator', e.target.value)}">
  {#each elevatorOpts as e}
    <option selected={elevator === e.url} value="{e.url}">{e.title}</option>
  {/each}
  </select>
  </label>
  {/if}
  </footer>
</article>

<PanicModal alt={1} open={votemodalopen}>
  <h3 class="modalheader" slot="title">Hey There!</h3>
  <div class="modalcontent" slot="content">You already voted for this track, are you sure you want to remove your vote?</div>
  <ul class="modalactions" slot="actions">
    <li><PanicButton on:click={() => removevote()}>Yes</PanicButton></li>
    <li><PanicButton type="transparent" on:click={() => votemodalopen = false}>Cancel</PanicButton></li>
  </ul>
</PanicModal>


<style lang="less">
  @import 'source/Styles/variables.less';

  article {
    min-height: 80%;
    max-width: unit(500px/@one-rem, rem);
    margin: auto;
    grid-template-rows: 50% 10% 25% auto;
    grid-template-areas: 
      "dj"
      "title"
      "progress"
      "vote";
    justify-items: center;
    align-items: center;
    border-radius: @track-radius;
    box-shadow: @track-shadow;

    &.track-alt-1 {
      background: @track-alt-1-bg;
      color: @track-alt-1-color;
    }
  }

  figure {
    width: 2.5rem;
    height: 2.5rem;
    margin: 0 auto;
  }

  header {
    grid-area: title;
    padding: unit(40px/@one-rem, rem);
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
  div {
    grid-area: progress;
  }
  footer {
    border-top: 2px solid @track-border-color;
    grid-area: vote;
    display: flex;
    button {
      flex: 1;
      background: none;
      border: none;
      outline: none;
      text-align: center;
      line-height: 2.5rem;
      font-size: 1rem;
      &:first-child {
        border-right: 2px solid @track-border-color;
      }
      &.disabled { opacity: 0.2; }
    }
    select {
      -moz-appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 1px solid @track-border-color;
      box-shadow: 0 0 0 1px @track-border-color;
      border-radius: @track-radius;
      flex: 1;
      color: @white;
      font-size: 0.5rem;
      padding: 0.5rem;
      outline: none;
      width: 100%;
    }
    label {
      display: block;
      width: 100%;
      margin: 1rem;
      position: relative;
      &:hover select {
        border-color: @white;
        box-shadow: 0 0 0 1px transparent;
      }
      &:hover {
        &:after {
          color: @white;
        }
      }
    }
    label:after {
      content: "▾";
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 1.5rem;
      font-size: 1rem;
      display: grid;
      place-items: center;
      color: @track-border-color;
      pointer-events: none;
      margin-top: -0.125rem;
    }
  }

  pre { 
    display: block; 
    font-family: monospace; 
    text-align: center;
    font-size: unit(20px/@one-rem, rem);
    padding: unit(20px/@one-rem, rem) 0;
  }

  .modalheader {
    padding: unit(20px/@one-rem, rem);
  }
  .modalcontent {
    padding: unit(20px/@one-rem, rem);
  }
  .modalactions {
    padding: unit(20px/@one-rem, rem);
    display: flex;
    flex-direction: row-reverse;
    li { flex: 1; }
    li:last-child { margin-right: unit(10px/@one-rem, rem); }
  }
  .score {
    font-size: 0.5rem;
    display: block;
  }
</style>

<script>
  import { createEventDispatcher } from 'svelte';
  import PanicModal from 'Components/Modal/Modal';
  import PanicButton from 'Components/Button/Button';
  import PanicAvatar from 'Components/Avatar/Avatar';
  import ProgressBar from 'Components/Progress/Progress';

  const dispatch = createEventDispatcher();

  export let voting = false;
  export let votes = {};
  export let elevator;
  export let playing;
  export let track;
  export let time;
  
  let votemodalopen = false;
  let vote = null;
  let elapsed;
  let length;
  let score;

  let elevatorOpts = [
    { title: "Easy Hits Florida", url: "http://airspectrum.cdnstream1.com:8114/1648_128", },
    { title: "BBC1 Radio", url: "http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_q", },
    { title: "Ambiesphere", url: "http://uk5.internet-radio.com:8347/;stream", },
    { title: "Party Vibe Radio: Hip Hop", url: "http://www.partyviberadio.com:8016/;stream/2", },
    { title: "Radio Bloodstream", url: "http://uk1.internet-radio.com:8294/live", },
    { title: "MoveDaHouse", url: "http://uk7.internet-radio.com:8000/;stream"},
    { title: "Austin Blues Radio", url: "http://ca10.rcast.net:8036/;stream/1"},
    { title: "Party Vibe Music", url: "http://uk6.internet-radio.com:8124/;stream"},
  ];

  $: {
    length = !track.length 
      ? '∞'
      : new Date(track.length * 1000).toISOString().substr(11,8);
    elapsed = new Date(time * 1000).toISOString().substr(11,8);
    score = Object.values(votes).reduce((a,v) => a += (v === 'like' ? 1 : -1),0);
  };

  function like(){
    if(vote !== null) return votemodalopen = true;
    vote = 'like';
    dispatch('vote', 'like');
  }

  function dislike(){
    if(vote !== null) return votemodalopen = true;
    vote = 'dislike';
    dispatch('vote', 'dislike');
  }

  function removevote(){
    dispatch('vote', null);
    votemodalopen = false;
  }
</script>