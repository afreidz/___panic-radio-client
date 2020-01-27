<script>
  import moment from 'moment';
  import { items } from './Store';
  import { createEventDispatcher } from 'svelte';
  import PanicButton from 'Components/Button/Button';
  import { request, reqtimeremaining } from 'Components/Booth/Store';

  const dispatch = createEventDispatcher();
  const interval = 1000;
  let timer;

  function formatTime(sec) {
    const d = moment.duration(sec * 1000);
    const m = `${d.minutes()}`.padStart(2, '0');
    const s = `${d.seconds()}`.padStart(2, '0');
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(m) || isNaN(s)) return '∞';
    return `${m}:${s}`;
  }

  function play(song) {
    clearInterval(timer);
    request.respond(song);
    dispatch('close');
  }

  let formattedtime = formatTime($reqtimeremaining);
  
  

  timer = setInterval(() => {
    reqtimeremaining.update((reqstate) => {
      const u = reqstate - 1;
      return u;
    });
    formattedtime = formatTime($reqtimeremaining);
    if ($reqtimeremaining <= 0) clearInterval(timer);
  }, interval);

  
</script>

<div class="play">
  <button class="close" on:click={() => dispatch('close')}>✕</button>
  <div class="content">
    <div class="tip">
      <strong>Its your turn to DJ</strong>
      <span class="clock">{formattedtime}</span>
      <small>remaining to play a song</small>
    </div>
    <ul class="items">
      {#each $items as entry, i (entry.media)}
        <li class="item">
          <section>
            <strong>{entry.title}</strong>
            <em>{entry.artist}</em>
          </section>
          <div class="action">
            <PanicButton on:click={() => play(entry)}>
              <i>▶</i>
              play
            </PanicButton>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style lang="less">
  @import 'source/Styles/index';

  .play {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 2rem min-content auto;
    grid-template-columns: 2rem auto;
    grid-template-areas:
      'close .'
      'tip tip'
      'main main';
  }
  .close {
    grid-area: close;
    border: none;
    background: none;
    outline: none;
    font-size: 1rem;
    color: @view-color;
    background: rgba(0, 0, 0, 0.3);
  }
  .content {
    grid-area: main;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
  }
  .tip {
    grid-area: tip;
    padding: 1rem;
    background: @tip-bg;
    text-align: center;

    strong,
    span,
    small {
      display: block;
      margin: 0 auto;
    }

    strong,
    small {
      font-size: unit(14px / @one-rem, rem);
    }
    span {
      font-size: 2rem;
      font-weight: 900;
      margin: 0.5rem auto;
    }
  }
  .items {
    flex-grow: 1;
    overflow-y: auto;
    padding: unit(15px / @one-rem, rem);
  }
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: unit(20px / @one-rem, rem);
    height: 2rem;
    border: 1px solid transparent;
    text-align: left;
    color: @view-color;

    section {
      flex-grow: 1;
      flex-shrink: 1;
      margin-left: unit(20px / @one-rem, rem);
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    strong {
      display: block;
      font-weight: 800;
      font-size: unit(16px / @one-rem, rem);
    }
    em {
      display: block;
      font-weight: 300;
      font-size: unit(12px / @one-rem, rem);
      opacity: 0.4;
    }
  }
  .action {
    flex-grow: 0;
    flex-shrink: 1;
    width: 3rem;

    i {
      display: inline-block;
      vertical-align: middle;
      font-size: unit(8px / @one-rem, rem);
    }
  }
</style>
