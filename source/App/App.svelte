<script>
  import 'Styles/index.less';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import PanicLogo from 'Assets/logo.svg';
  import PanicMenu from 'Components/Menu/Menu';
  import PanicPlay from 'Components/Crate/Play';
  import PanicBooth from 'Components/Booth/Booth';
  import PanicCrate from 'Components/Crate/Crate';
  import PanicTrack from 'Components/Track/Track';
  import PanicModal from 'Components/Modal/Modal';
  import PanicProTip from 'Components/ProTip/Tip';
  import PanicSearch from 'Components/Crate/Search';
  import PanicButton from 'Components/Button/Button';
  import PanicPreview from 'Components/Crate/Preview';
  import PanicControls from 'Components/Menu/Controls';
  import PanicMenuToggle from 'Components/Menu/Toggle';
  import { open as menuopen } from 'Components/Menu/Store';
  import { openviews, photo, backgrounded } from 'App/Store';
  import PanicListeners from 'Components/Listeners/Listeners';
  import PanicListenerDetails from 'Components/Listeners/Details';
  import { tracks, current, elevator } from 'Components/Track/Store';
  import { visibilityChange, hiddenprop } from 'Utilities/backgrounded';

  const viewfly = { x: -200, duration: 500 };
  const tracksections = [];

  let warned = false;
  let currentidx = 0;

  onMount(() => {
    document.addEventListener(
      visibilityChange,
      () => {
        if (document[hiddenprop]) return backgrounded.update(() => true);
        return backgrounded.update(() => false);
      },
      false,
    );
  });

  function enter() {
    warned = true;
    new Audio('./assets/enter.mp3').play();
  }

  function end() {
    $current = null;
    currentidx += 1;
    if ($tracks[currentidx]) {
      tracksections[currentidx].scrollIntoView({ behavior: 'smooth' });
    } else {
      tracks.reset();
      currentidx = 0;
    }
  }

  function setmeta(track) {
    let details;
    if (track === 'down') {
      details = {
        title: 'PanicRadio - Nothing',
        artist: 'nobody',
        artwork: [{ src: '/assets/emoji.png', type: 'image/png' }],
      };
    } else {
      details = {
        title: 'PanicRadio - Something',
        artist: 'somebody',
        artwork: [{ src: $photo, type: 'image/png' }],
      };
    }

    navigator.mediaSession.metadata = new window.MediaMetadata(details);
  }

  function play() {
    if ($current.src === $elevator) return setmeta('down');
    $current.src = $current.dataset.src;
    $current.onended = end;
    $current.play();
    return true;
  }

  $: if ($current) play();
</script>

<svelte:head>
  <meta name="theme-color" content="#192C9B" />
</svelte:head>

<div id="app">
  <header>
    <h1>
      <PanicLogo />
    </h1>
    <PanicMenuToggle area="menu" on:click={() => { $menuopen = !$menuopen; }} />
  </header>

  <main>
    {#if !warned}
      <section class="warning">
        <PanicProTip
          type="Warning!"
          size="large"
          tip={'This site ... wait for it ... plays audio! Shocking, I know.  Please be advised that the fine friends at Goolge require that you be ABSOLUTELY SURE you want this to happen.  Therefore no audio will play until you acknowledge this warning and proceed anyway.  Your ears have been warned!'} />
        <div>
          <PanicButton on:click={enter}>I understand, let me in!</PanicButton>
        </div>
      </section>
    {:else if $tracks.length}
      {#each $tracks as track, i}
        <section bind:this={tracksections[i]}>
          <PanicTrack active={i === currentidx} voting={true} {track} />
        </section>
      {/each}
    {:else}
      <section transition:fly={{ y: 100, duration: 500 }}>
        <PanicTrack
          active={true}
          voting={false}
          elevator={true}
          track={{ title: 'Nothing', artist: 'Nobody', dj: 'system' }} />
      </section>
    {/if}
  </main>

  {#if $menuopen}
    <div class="view" transition:fly={viewfly}>
      <PanicMenu />
    </div>
  {/if}

  {#if [...$openviews].includes('crate')}
    <div class="view" transition:fly={viewfly}>
      <PanicCrate on:close={() => openviews.delete('crate')} />
    </div>
  {/if}

  {#if [...$openviews].includes('search')}
    <div class="view" transition:fly={viewfly}>
      <PanicSearch on:close={() => openviews.delete('search')} />
    </div>
  {/if}

  {#if [...$openviews].includes('preview')}
    <div class="view" transition:fly={viewfly}>
      <PanicPreview on:close={() => openviews.delete('preview')} />
    </div>
  {/if}

  {#if [...$openviews].includes('listenerdetails')}
    <div class="view" transition:fly={viewfly}>
      <PanicListenerDetails
        on:close={() => openviews.delete('listenerdetails')} />
    </div>
  {/if}

  {#if [...$openviews].includes('play')}
    <div class="view" transition:fly={viewfly}>
      <PanicPlay on:close={() => openviews.delete('play')} />
    </div>
  {/if}

  <PanicControls />

  <footer>
    <PanicBooth area="booth" />
    <PanicListeners area="listeners" />
  </footer>

  <PanicModal />
</div>

<style lang="less">
  @import '../Styles/index.less';

  #app {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  header,
  main,
  footer {
    min-width: 320px;
  }

  header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 2rem;
    display: grid;
    grid-template-columns: 2rem auto 2rem;
    grid-template-areas: 'menu logo test';

    h1 {
      grid-area: logo;
      height: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }

    button {
      grid-area: test;
    }
  }

  main {
    flex-grow: 1;
    position: fixed;
    left: 0;
    right: 0;
    top: 2rem;
    bottom: 2rem;
    overflow: auto;
    scroll-snap-type: y mandatory;
    padding-bottom: 37.5vh;

    &::-webkit-scrollbar {
      display: none;
    }

    section {
      width: 100%;
      height: 70vh;
      padding-top: 10vh;
      scroll-snap-align: start;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      perspective: 1200px;
    }

    section.warning {
      margin: auto;
      width: 80vw;
      max-width: unit(500px / @one-rem, rem);
      > div {
        margin-top: 1rem;
        width: 100%;
      }
    }
  }

  .view {
    width: 100%;
    height: 100%;
    max-width: unit(600px / @one-rem, rem);
    background: @view-bg;
    color: @view-color;
    box-shadow: @view-shadow;
    position: absolute;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
  }

  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 2rem;
    display: grid;
    background: @menu-bg;
    border-top: @menu-item-border;
    display: grid;
    grid-template-columns: 8rem auto;
    grid-template-areas: 'booth listeners';
  }
</style>
