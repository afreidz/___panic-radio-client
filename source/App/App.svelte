<main id="app">
  <PanicLogo area="logo"/>
  {#if $room === 'lobby'}
    {#await lobby}
    <PanicLoader/>
    {:then rooms}
    <PanicLobby area="audio" rooms={rooms}/>
    {/await}
  {:else}
  <PanicMenuToggle 
    area="menu" 
    on:click={() => $menuopen = !$menuopen}
  />
  <PanicMenu 
    area="menu"
    on:crate={crate}
  />
  <PanicControls 
    area="controls"
    on:crate={crate}
  />
  <PanicBooth area="booth"/>
  <PanicAudio area="audio"/>
  <PanicListeners area="listeners"/>
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

<style lang="less">
  @import '../Styles/index.less';

  #app {
    width: 100%;
    max-width: 100%;
    min-height: 100%;
    display: grid;
    grid-template-columns: 2rem auto 2rem;
    grid-template-rows: 2rem 3rem 4rem auto 3rem;
    grid-template-areas: 
      "menu controls ."
      ". logo ."
      ". booth ."
      ". audio ."
      "listeners listeners listeners";
    grid-column-gap: 1px;
    grid-row-gap: 1px;
    place-items: center;
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
  import PanicLogo from 'Assets/Logo.svg';
  import getrooms from 'Utilities/getrooms';
  import PanicLoader from 'Assets/loader.svg';
  import { room, openviews } from 'App/Store';
  import PanicMenu from 'Components/Menu/Menu';
  import PanicLobby from 'Components/Lobby/Lobby';
  import PanicBooth from 'Components/Booth/Booth';
  import PanicAudio from 'Components/Audio/Audio';
  import PanicCrate from 'Components/Crate/Crate';
  import PanicSearch from 'Components/Crate/Search';
  import PanicPreview from 'Components/Crate/Preview';
  import PanicControls from 'Components/Menu/Controls';
  import PanicMenuToggle from 'Components/Menu/Toggle';
  import { open as menuopen } from 'Components/Menu/Store';
  import PanicListeners from 'Components/Listeners/Listeners';

  let lobby;
  $: { if($room === 'lobby') lobby = getrooms() }

  function crate(){
    openviews.delete('search')
    openviews.add('crate');
    $menuopen = false;
  }
</script>
