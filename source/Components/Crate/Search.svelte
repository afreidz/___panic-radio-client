<div class="crate">
  <button class="close" on:click={close}>✕</button>
  <form on:submit|preventDefault={handlesearch}>
    <label class="search">
      <input 
        type="text" 
        name="search"
        value={$query}
        bind:this={searchelm}
      />
      <span>🔍</span>
    </label>
  </form>
  <div class="content">
    <!-- <ul class="tabs">
      <li class:active={active === 'yt'}>
        <button on:click={() => active = 'yt'}><YouTubeIcon/></button>
      </li>
      <li class:active={active === 'sc'}>
        <button on:click={() => active = 'sc'}><SoundCloudIcon/></button>
      </li>
      <li class:active={active === 'bc'}>
        <button on:click={() => active = 'bc'}><BandcampIcon/></button>      
      </li>
    </ul> -->
    {#if !!$loading}
    <div class="loadingstate">
      <PanicLoader/>
    </div>
    {:else if !$results[active].length}
    <div class="nullstate">
      <p>
        {#if !!searchelm && !!searchelm.value}
        <span>Could not find any results for "{searchelm.value}"</span>
        <small>Please try your search again</small>
        {:else}
        <span>You have {$items.length} song{#if $items.length !== 1}s{/if} in your crate.</span>  
        <small>Search to add more</small>
        {/if}
      </p>
    </div>
    {:else}
    <ul class="items">
    {#each $results[active] as result}
    <li class="searchresult">
      {#if result.preview}
      <button class="preview" on:click={() => previewtrack(result.preview)}>▶️</button>
      {/if}
      <p>
        <strong>{@html result.title}</strong>
        <em>{@html result.artist} ({moment(result.duration).format('mm:ss')})</em>
      </p>
      <button class="addtocrate" on:click={(e) => addtocrate(result, e)}>+</button>
    </li>
    {/each}
    </ul>
    {/if}
  </div>
</div>

<style lang="less">
  @import 'source/Styles/index';

  .crate {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 2rem auto;
    grid-template-columns: 2rem auto;
    grid-template-areas: 
      'close search'
      'main main';
  }
  .close { 
    grid-area: close; 
    border: none;
    background: none;
    outline: none;
    font-size: 1rem;
    color: @view-color;
    background: rgba(0,0,0,0.3);
  }
  .search {
    grid-area: search;
    font-size: 1rem;
    display: flex;
    padding-left: unit(15px/@one-rem, rem);

    input { 
      flex-grow: 1;
      width: 1px;
      font-size: 1rem;
      border: none;
      background: none;
      outline: none;
      color: @view-color;
      font-weight: bold;

      &:focus {
        border-bottom: 1px solid @view-color;
      }
    }

    span {
      flex-grow: 0;
      line-height: 2rem;
      width: 2rem;
      text-align: center;
    }
  }
  .content {
    grid-area: main;
    display: flex;
    flex-direction: column;
    overflow: auto;

    .tabs {
      margin-top: unit(10px/@one-rem, rem);
      display: flex;
      li {
        flex-grow: 1;
        height: 2rem;

        &.active, &:hover {
          background: rgba(0,0,0,0.3);
        }
      }
      button {
        border: none;
        background: none;
        outline: none;
        color: @view-color;
        width: 100%;
        height: 100%;

        :global( & svg){
          width: 1.1rem;
          height: 1.1rem;
          g { fill: @view-color; }
        }
      }
    }
    .items, .nullstate, .loadingstate {
      flex-grow: 1;
      background: rgba(0,0,0,0.3);
      overflow-y: auto;
      padding: 0 unit(15px/@one-rem, rem);

      li {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: unit(20px/@one-rem, rem);
        height: 2rem;
        border: 1px solid transparent;
        p {
          flex-grow: 1;
          margin-left: unit(20px/@one-rem, rem);
        }
        strong { 
          display: block;
          font-weight: 800;
          font-size: unit(16px/@one-rem, rem);
        }
        em { 
          display: block;
          font-weight: 300;
          font-size: unit(12px/@one-rem, rem);
          opacity: 0.4;
        }
        .preview, .addtocrate {
          display: block;
          border: none;
          background: none;
          outline: none;
          font-size: 1rem;
          color: @view-color;
          padding: 0;
          margin: 0;
          width: 1rem;
          height: 1rem;
          &:disabled { 
            opacity: 0.1;
          }
        }
      }
    }
    .nullstate, .loadingstate {
      display: grid;
      place-items: center;
      p { font-size: unit(20px/@one-rem, rem); }
      small { 
        font-size: unit(16px/@one-rem, rem); 
        opacity: 0.3; 
        display: block; 
        text-align: center; 
      }
    }
  }
</style>

<script>
  import moment from 'moment';
  import { socket } from 'App/Store';
  import { openviews } from 'App/Store';
  import PanicLoader from 'Assets/loader';
  import YouTubeIcon from 'Assets/youtube';
  import BandcampIcon from 'Assets/bandcamp';
  import { createEventDispatcher } from 'svelte';
  import SoundCloudIcon from 'Assets/soundcloud';
  import { items, preview, results, query, loading } from './Store';

  let dispatch = createEventDispatcher();
  let active = 'yt';
  let searchelm;
  let player;

  $: if(searchelm) searchelm.focus();

  function handlesearch() {
    results.reset();
    if(!searchelm.value || searchelm.value.length <= 2) return loading.force(false);
    if(searchelm.value !== $query) $query = searchelm.value;
    $socket.sendhost({ type: 'search', query: $query });
  }

  function addtocrate(entry, e = null){
    $items = [...$items, entry];
    if(!!e) e.target.disabled = true;
  }

  function previewtrack(url){
    console.log(url);
    $preview = url;
    openviews.add('preview');
  }

  function close(){
    $query = null;
    results.reset();
    loading.force(false);
    dispatch('close');
  }
</script>