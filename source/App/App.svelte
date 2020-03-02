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
  import PanicProTip from 'Components/ProTip/Tip';
  import PanicSearch from 'Components/Crate/Search';
  import PanicButton from 'Components/Button/Button';
  // import PanicPreview from 'Components/Crate/Preview';
  import PanicControls from 'Components/Menu/Controls';
  import PanicMenuToggle from 'Components/Menu/Toggle';
  import PanicListeners from 'Components/Listeners/Listeners';
  import PanicListenerDetails from 'Components/Listeners/Details';
  import { visibilityChange, hiddenprop } from 'Utilities/backgrounded';
  import {
    muted,
    items,
    tracks,
    socket,
    userid,
    members,
    request,
    username,
    openviews,
    listeners,
    anonymous,
    backgrounded,
    listenerdetails,
  } from 'App/Store';

  const viewfly = { x: -200, duration: 500 };
  const trackcomponents = [];
  // const tracksections = [];
  let warned = false;
  let current = 0;

  $: if (trackcomponents[current]) trackcomponents[current].$set({ active: true });

  function showprofile() {
    listenerdetails.update(() => $listeners.find((l) => l.id === $userid));
    openviews.add('listenerdetails');
  }

  function respond(e) {
    $socket.sendhost({ type: 'play', song: e.detail });
  }

  function background() {
    backgrounded.update(() => document[hiddenprop]);
  }

  function addtocrate(e) {
    items.update(() => [...$items, e.detail]);
  }

  function enter() {
    warned = true;
    muted.update(() => false);
    new Audio('./assets/enter.mp3').play();
  }

  function end() {
    const next = trackcomponents[current + 1];
    if (!next) return;

    const section = document.getElementById(`track_${next.track.id}`);

    next.$set({ active: true });
    section.scrollIntoView({ behavior: 'smooth' });
    current += 1;
  }

  onMount(() => {
    socket.subscribe((s) => console.log('Connected to: ', s.connectionURL));
    document.addEventListener(visibilityChange, background, false);
  });

  // function end() {
  //   $current = null;
  //   currentidx += 1;
  //   if ($tracks[currentidx]) {
  //     tracksections[currentidx].scrollIntoView({ behavior: 'smooth' });
  //   } else {
  //     tracks.reset();
  //     currentidx = 0;
  //   }
  // }

  // function setmeta(track) {
  //   const dj = $listeners.find((l) => l.id === track.dj) || {};
  //   let details;
  //   if (track === 'down') {
  //     details = {
  //       title: 'PanicRadio - Nothing',
  //       artist: 'nobody',
  //       artwork: [{ src: '/assets/emoji.png', type: 'image/png' }],
  //     };
  //   } else {
  //     details = {
  //       title: track.title,
  //       artist: track.artist,
  //       artwork: [{ src: dj.photo || '/assets/emoji.png', type: 'image/png' }],
  //     };
  //   }

  //   navigator.mediaSession.metadata = new window.MediaMetadata(details);
  // }

  // function play() {
  //   if ($current.src === $elevator) return setmeta('down');
  //   $current.src = $current.dataset.src;
  //   $current.onended = end;
  //   $current.play();
  //   setmeta($tracks[currentidx]);
  //   return true;
  // }
</script>

<svelte:head>
  <meta name="theme-color" content="#192C9B" />
</svelte:head>

<div id="app">
  <header>
    <h1>
      <PanicLogo />
    </h1>
    <PanicMenuToggle area="menu" on:click={() => openviews.add('menu')} />
  </header>

  <main>
    {#if !warned}
      <section class="warning">
        <PanicProTip
          type="Warning!"
          size="large"
          tip={'This site ... wait for it ... plays audio! Shocking.  Please be advised that the fine friends at Goolge require that you be ABSOLUTELY SURE you want this to happen.  Therefore no audio will play until you acknowledge this warning and proceed anyway.  Your ears have been warned!'} />
        <div>
          <PanicButton on:click={enter}>I understand, let me in!</PanicButton>
        </div>
      </section>
    {:else}
      {#each [...$tracks.values()] as track, i (track.id)}
        <section id="track_{track.id}">
          <PanicTrack
            {track}
            on:end={end}
            voting={true}
            muted={$muted}
            active={false}
            bind:this={trackcomponents[i]}
            member={$listeners.find((l) => l.id === track.member)} />
        </section>
      {/each}
    {/if}
  </main>

  {#if [...$openviews].includes('menu')}
    <div class="view" transition:fly={viewfly}>
      <PanicMenu
        muted={$muted}
        controls={true}
        username={$username}
        anonymous={$anonymous}
        on:profile={showprofile}
        on:crate={() => openviews.add('crate')}
        on:mute={() => muted.update((m) => !m)}
        on:close={() => openviews.delete('menu')}
        on:anonymous={() => anonymous.update((a) => !a)} />
    </div>
  {/if}

  {#if [...$openviews].includes('crate')}
    <div class="view" transition:fly={viewfly}>
      <PanicCrate
        items={$items}
        on:close={() => openviews.delete('crate')}
        on:save={(newItems) => {
          $items = newItems;
        }} />
    </div>
  {/if}

  {#if [...$openviews].includes('search')}
    <div class="view" transition:fly={viewfly}>
      <PanicSearch
        on:add={addtocrate}
        items={$items.length}
        on:preview={() => console.log('preview')}
        on:close={() => openviews.delete('search')} />
    </div>
  {/if}

  {#if [...$openviews].includes('listenerdetails')}
    <div class="view" transition:fly={viewfly}>
      <PanicListenerDetails
        listener={$listenerdetails}
        editable={$listenerdetails.id === $userid}
        on:close={() => openviews.delete('listenerdetails')} />
    </div>
  {/if}

  {#if [...$openviews].includes('play')}
    <div class="view" transition:fly={viewfly}>
      <PanicPlay
        items={$items}
        on:play={respond}
        remaining={$request}
        on:close={() => openviews.delete('play')} />
    </div>
  {/if}

  <PanicControls
    muted={$muted}
    anonymous={$anonymous}
    on:profile={showprofile}
    on:crate={() => openviews.add('crate')}
    on:mute={() => muted.update((m) => !m)} />

  <footer>
    <PanicBooth
      area="booth"
      members={$members}
      canjoin={$items.length !== 0}
      on:crate={() => openviews.add('crate')}
      on:join={() => $socket.sendhost({ type: 'join' })}
      on:leave={() => $socket.sendhost({ type: 'leave' })}
      member={$members.map((m) => m && m.id).includes($userid)} />
    <PanicListeners listeners={$listeners} />
  </footer>
</div>
<!-- <PanicPreview /> -->

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
