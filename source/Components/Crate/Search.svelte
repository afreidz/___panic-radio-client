<script>
  import moment from 'moment';
  import { socket } from 'App/Store';
  import PanicLoader from 'Assets/loader';
  import { createEventDispatcher } from 'svelte';

  export let items = 0;

  const dispatch = createEventDispatcher();
  let loading = false;
  let query = null;
  let results = [];
  let search;

  $: if (search) search.focus();
  $: $socket.onhostmessage('searchresults', (data) => {
    results = data.results;
    loading = false;
  });

  function handlesearch() {
    results = [];
    if (!search.value || search.value.length <= 2) {
      loading = false;
      return;
    }
    loading = true;
    if (search.value !== query) query = search.value;
    $socket.sendhost({ type: 'search', query });
  }

  function addtocrate(entry, e = null) {
    if (e) e.target.disabled = true;
    dispatch('add', entry);
  }

  function previewtrack(url) {
    dispatch('preview', url);
  }

  function close() {
    query = null;
    results = [];
    loading = false;
    dispatch('close');
  }
</script>

<div class="crate">
  <button class="close" on:click={close}>✕</button>
  <form on:submit|preventDefault={handlesearch}>
    <label class="search">
      <input type="text" name="search" value={query} bind:this={search} />
      <span>🔍</span>
    </label>
  </form>
  <div class="content">
    {#if !!loading}
      <div class="loadingstate">
        <PanicLoader />
      </div>
    {:else if !results.length}
      <div class="nullstate">
        <p>
          {#if search && search.value}
            <span>Could not find any results for "{search.value}"</span>
            <small>Please try your search again</small>
          {:else}
            <span>
              You have {items} song
              {#if items !== 1}s{/if}
              in your crate.
            </span>
            <small>Search to add more</small>
          {/if}
        </p>
      </div>
    {:else}
      <ul class="items">
        {#each results as result (result.media)}
          <li class="searchresult">
            <button class="preview" on:click={() => previewtrack(result.media)}>▶️</button>
            <p>
              <strong>
                {@html result.title}
              </strong>
              <em>
                {@html result.artist}
                ({moment(result.seconds * 1000).format('mm:ss')})
              </em>
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
    background: rgba(0, 0, 0, 0.3);
  }
  .search {
    grid-area: search;
    font-size: 1rem;
    display: flex;
    padding-left: unit(15px / @one-rem, rem);

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
      margin-top: unit(10px / @one-rem, rem);
      display: flex;
      li {
        flex-grow: 1;
        height: 2rem;

        &.active,
        &:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      }
      button {
        border: none;
        background: none;
        outline: none;
        color: @view-color;
        width: 100%;
        height: 100%;

        :global(& svg) {
          width: 1.1rem;
          height: 1.1rem;
          g {
            fill: @view-color;
          }
        }
      }
    }
    .items,
    .nullstate,
    .loadingstate {
      flex-grow: 1;
      background: rgba(0, 0, 0, 0.3);
      overflow-y: auto;
      padding: 0 unit(15px / @one-rem, rem);

      li {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: unit(20px / @one-rem, rem);
        height: 2rem;
        border: 1px solid transparent;
        p {
          flex-grow: 1;
          margin-left: unit(20px / @one-rem, rem);
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
        .preview,
        .addtocrate {
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
    .nullstate,
    .loadingstate {
      display: grid;
      place-items: center;
      p {
        font-size: unit(20px / @one-rem, rem);
      }
      small {
        font-size: unit(16px / @one-rem, rem);
        opacity: 0.3;
        display: block;
        text-align: center;
      }
    }
  }
</style>
