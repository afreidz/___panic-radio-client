<div id="app">
  <header>
    <h1><PanicLogo/></h1>
    <PanicMenuToggle 
      area="menu" 
      on:click={() => $menuopen = !$menuopen}
    />
  </header>
  
  <main>
    {#if !warned}
    <button id="warn" on:click={() => warned = true}>Click to acknowledge autoplay</button>
    {:else}
    {#if $tracks.length}
      {#each $tracks as track, i}
      <section bind:this={tracksections[i]}>
        <PanicTrack 
          active={i === currentidx}
          track={track} 
        />
      </section>
      {/each}
    {:else}
    <section transition:fly="{{ y: 100, duration: 500 }}">
      <PanicTrack
        active={true}
        elevator={true}
        track="{{ 
          title: 'Nothing', 
          artist: 'Nobody', 
          dj: 'system' 
        }}"
      />
    </section>
    {/if}
    {/if}
  </main>

  {#if [...$openviews].length}
  <section class="subviews">
    
    {#if [...$openviews].includes('crate')}
    <PanicCrate on:close={() => openviews.delete('crate')}/>
    {/if}

    {#if [...$openviews].includes('search')}
    <PanicSearch on:close={() => openviews.delete('search')}/>
    {/if}
    
    {#if [...$openviews].includes('preview')}
    <PanicPreview on:close={() => openviews.delete('preview')}/>
    {/if}

  </section>
  {/if}

  <PanicMenu on:crate={crate}/>
  <PanicControls on:crate={crate}/>
  
  <footer>
    <PanicBooth area="booth"/>
    <PanicListeners area="listeners"/>
  </footer>
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

  header, main, footer { min-width: 320px; }

  header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 2rem;
    display: grid;
    grid-template-columns: 2rem auto 2rem;
    grid-template-areas: "menu logo test";

    h1 { 
      grid-area: logo; 
      height: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;
    }

    button { grid-area: test; }
  }

  main {
    flex-grow: 1;
    position: fixed;
    left: 0; right: 0;
    top: 2rem; bottom: 2rem;
    
    overflow: hidden;
    /* overflow: auto; */
    /* scroll-snap-type: y mandatory; */
    padding-bottom: 37.5vh;

    section {
      width: 100%;
      height: 70vh;
      padding-top: 10vh;
      /* scroll-snap-align: start; */
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      perspective: 1200px;
    }
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
    grid-template-areas: "booth listeners";
  }

  .subviews {
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    z-index: 3;
    max-width: unit(600px/@one-rem, rem);
  }
</style>

<script>
  import 'Styles/index.less';
  import { fly } from 'svelte/transition';
  import PanicLogo from 'Assets/Logo.svg';
  import getrooms from 'Utilities/getrooms';
  import PanicLoader from 'Assets/loader.svg';
  import { room, openviews } from 'App/Store';
  import PanicMenu from 'Components/Menu/Menu';
  import PanicLobby from 'Components/Lobby/Lobby';
  import PanicBooth from 'Components/Booth/Booth';
  import PanicCrate from 'Components/Crate/Crate';
  import PanicTrack from 'Components/Track/Track';
  import PanicSearch from 'Components/Crate/Search';
  import PanicPreview from 'Components/Crate/Preview';
  import PanicControls from 'Components/Menu/Controls';
  import PanicMenuToggle from 'Components/Menu/Toggle';
  import { open as menuopen } from 'Components/Menu/Store';
  import PanicListeners from 'Components/Listeners/Listeners';
  import { tracks, current, elevator } from 'Components/Track/Store';

  let tracksections = [];
  let playing = false;
  let currentidx = 0;
  let warned = false;

  $: if(!!$current) play();

  function play(){
    if($current.src === $elevator) return;
    $current.src = $current.dataset.src;
    $current.onended = end;
    playing = true;
    $current.play();
  }

  function end(){
    $current = null;
    currentidx += 1;
    playing = false;
    if($tracks[currentidx]){
      tracksections[currentidx].scrollIntoView({ behavior: 'smooth' });
    }else{
      tracks.reset();
      currentidx = 0;
    }
  }

  function crate(){
    openviews.delete('search');
    openviews.add('crate');
    $menuopen = false;
  }
</script>
