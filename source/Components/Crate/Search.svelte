<div class="crate">
  <button class="close" on:click={() => dispatch('close')}>✕</button>
  <form on:submit|preventDefault={handlesearch}>
    <label class="search">
      <input 
        type="text" 
        name="search"
        value={query}
        bind:this={search}
      />
      <span>🔍</span>
    </label>
  </form>
  <div class="content">
    <ul class="tabs">
      <li class:active={active === 'yt'}>
        <button on:click={() => setsearch('yt')}><YouTubeIcon/></button>
      </li>
      <li class:active={active === 'sc'}>
        <button on:click={() => setsearch('sc')}><SoundCloudIcon/></button>
      </li>
      <li class:active={active === 'bc'}>
        <button on:click={() => setsearch('bc')}><BandcampIcon/></button>      
      </li>
    </ul>
    {#if !results[active].length}
    {#if !!loadingstate}
    <div class="loadingstate">
      <PanicLoader/>
    </div>
    {:else}
    <div class="nullstate">
      <p>
        {#if !!search && !!search.value}
        <span>Could not find any results for "{search.value}"</span>
        <small>Please try your search again</small>
        {:else}
        <span>You have {$items} song{#if items !== 1}s{/if} in your crate.</span>  
        <small>Search to add more</small>
        {/if}
      </p>
    </div>
    {/if}
    {:else}
    <ul class="items">
    {#each results[active] as result}
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
    max-width: unit(1200px/@one-rem, rem);
    display: grid;
    grid-template-rows: 2rem auto;
    grid-template-columns: 2rem auto;
    background: @view-bg;
    color: @view-color;
    box-shadow: @view-shadow;
    grid-template-areas: 
      'close search'
      'main main';
    position: absolute;
  }
  .close { 
    grid-area: close; 
    border: none;
    background: none;
    outline: none;
    font-size: 1rem;
    color: @view-color;
  }
  .search {
    grid-area: search;
    font-size: 1rem;
    display: flex;

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
  import { onMount } from 'svelte';
  import { openviews } from 'App/Store';
  import PanicLoader from 'Assets/loader';
  import searchAPI from 'Utilities/search';
  import { items, preview } from './Store';
  import YouTubeIcon from 'Assets/youtube';
  import BandcampIcon from 'Assets/bandcamp';
  import { createEventDispatcher } from 'svelte';
  import SoundCloudIcon from 'Assets/soundcloud';
  
  let dispatch = createEventDispatcher();
  let loadingstate = false;
  let active = 'yt';
  let query = null;
  let results = {
    yt: [],
    sc: [],
    bc: [],
  };
  let search;
  let player;

  onMount(() => {
    if(search) search.focus();
  });

  function setsearch(provider){
    active = provider;
    if(search.value.length > 5) return handlesearch();
  }

  async function handlesearch() {
    if(!search.value) return false;
    loadingstate = true;
    if(search.value.length <= 2) return false
    if(search.value !== query) {
      query = search.value;
      results.yt = [];
      results.sc = [];
      results.bc = [];
      results[active] = await searchAPI({ query }, active);
    }
    if(!results[active].length) results[active] = await searchAPI({ query }, active);
    loadingstate = false;
  }

  function addtocrate(entry, e = null){
    $items = [...$items, entry];
    openviews.add('crate');
    openviews.delete('search');
    if(!!e) e.target.disabled = true;
  }

  function previewtrack(url){
    $preview = url;
    openviews.add('preview');
  }
</script>