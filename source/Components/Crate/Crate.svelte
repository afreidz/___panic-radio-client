<script>
  import Sortable from 'sortablejs';
  import { createEventDispatcher } from 'svelte';
  import PanicModal from 'Components/Modal/Modal';
  import PanicProTip from 'Components/ProTip/Tip';
  import PanicHolder from 'Components/Button/Holder';
  import { openviews, preview, autoplay } from 'App/Store';

  const dispatch = createEventDispatcher();

  export let items = [];

  let allselected = false;
  let confirmed = false;
  let editing = false;
  let searchButton;
  let crateitems;

  function move(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      while (k >= 0) {
        k -= 1;
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
  }

  function save(e) {
    const newItems = move(items, e.oldIndex, e.newIndex);
    dispatch('save', newItems);
  }

  function done() {
    editing = false;
  }

  function edit() {
    editing = true;
  }

  function selectall() {
    allselected = !allselected;
    items = items.map((i) => ({ ...i, selected: allselected }));
  }

  async function trash() {
    if (!confirmed) {
      const modal = new PanicModal({
        intro: true,
        target: document.body,
        props: {
          open: true,
          label: 'yes',
          cancel: true,
          title: 'Are you sure?',
          content: `You are about to remove ${items.filter((i) => i.selected).length} songs.`,
        },
      });
      modal.$on('close', () => modal.$destroy());
      modal.$on('trigger', () => {
        confirmed = true;
        trash();
      });
    } else {
      const newItems = items.filter((i) => !i.selected);
      dispatch('save', newItems);
      confirmed = false;
      done();
    }
  }

  function previewtrack(url) {
    $preview = url;
  }

  $: {
    if (items.length && crateitems) {
      Sortable.create(crateitems, {
        sort: true,
        onUpdate: save,
        handle: '.sorter',
      });
    }
  }
</script>

<div class="crate" class:editing>
  {#if editing}
    <button class="trash" on:click={trash}>🗑️</button>
    <button class="selectall" on:click={selectall}>✅</button>
    <button class="done" on:click={done}>👍</button>
    <div class="options">
      <label>
        <input type="checkbox" bind:checked={$autoplay} />
        <span>
          <em>Autoplay</em>
          the next track when requested?
        </span>
      </label>
    </div>
  {:else}
    <button class="close" on:click={() => dispatch('close')}>✕</button>
    <button class="search" bind:this={searchButton} on:click={() => openviews.add('search')}>
      🔍
    </button>
  {/if}
  <div class="content">
    {#if !items.length}
      <div class="nullstate">
        <p>
          <span>
            You have {items.length} song
            {#if items.length !== 1}s{/if}
            in your crate.
          </span>
          <small>Search to add more</small>
        </p>
      </div>
    {:else}
      <ul class="items" bind:this={crateitems}>
        {#each items as entry, i (entry.media)}
          <li>
            <PanicHolder on:hold={edit}>
              <div class="crateitem">
                {#if editing}
                  <input
                    type="checkbox"
                    id={`select_${entry.id}`}
                    name={`select_${entry.id}`}
                    bind:checked={entry.selected} />
                  <label class="selector" for={`select_${entry.id}`}>
                    <strong>
                      {@html entry.title}
                    </strong>
                    <em>
                      {@html entry.artist}
                    </em>
                  </label>
                  <button class="sorter">
                    <span>☰</span>
                  </button>
                {:else}
                  <button class="preview" on:click={() => previewtrack(entry.media)}>▶️</button>
                  <p>
                    <strong>
                      {@html entry.title}
                    </strong>
                    <em>
                      {@html entry.artist}
                    </em>
                  </p>
                {/if}
              </div>
            </PanicHolder>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
  <PanicProTip
    area="tip"
    type="ProTip!"
    tip={'Click and hold a crate item to enable "edit mode" where you can remove and reorder tracks in your crate'} />
</div>

<style lang="less">
  @import 'source/Styles/index';

  .crate {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 2rem 2rem auto 2rem;
    grid-template-rows: 2rem min-content auto 2rem;
    grid-template-areas:
      'close trash . search'
      'opts opts opts opts'
      'main main main main'
      'tip tip tip tip';
  }

  input[type='checkbox'] {
    visibility: hidden;
    position: relative;
    width: 1rem;
    height: 1rem;
    margin: 0;
    padding: 0;

    &:after {
      visibility: visible;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      font-size: 1rem;
      content: '⬜';
      opacity: 0.5;
    }
    &:checked:after {
      content: '✅';
      opacity: 1;
    }
  }

  .options {
    grid-area: opts;
    padding: 1rem;
    background: @tip-bg;
    text-align: center;

    label {
      display: block;
      margin: 0 auto;
      span {
        display: inline-block;
        vertical-align: middle;
        line-height: 1rem;
        font-size: unit(18px / @one-rem, rem);
      }
      input {
        display: inline-block;
        vertical-align: middle;
        margin-right: 0.5rem;
      }
      em {
        font-weight: 700;
      }
    }
  }

  .close,
  .selectall,
  .trash,
  .search,
  .done {
    border: none;
    background: none;
    outline: none;
    font-size: 1rem;
    color: @view-color;
  }

  .close {
    background: rgba(0, 0, 0, 0.3);
  }

  .close,
  .selectall {
    grid-area: close;
  }
  .trash {
    grid-area: trash;
    justify-self: end;
  }
  .search,
  .done {
    grid-area: search;
  }
  .content {
    grid-area: main;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .items,
    .nullstate {
      flex-grow: 1;
      background: rgba(0, 0, 0, 0.3);
      overflow-y: auto;
      padding: unit(15px / @one-rem, rem);
      .crateitem {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: unit(20px / @one-rem, rem);
        height: 2rem;
        border: 1px solid transparent;
        text-align: left;
        color: @view-color;

        label,
        p {
          flex-grow: 1;
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
        .preview,
        .sorter,
        .placeholder {
          display: block;
          border: none;
          background: none;
          outline: none;
          font-size: 1rem;
          color: @view-color;
          padding: 0;
          margin: 0;
        }
        .sorter {
          opacity: 0.5;
        }
        .placeholder {
          opacity: 0.1;
        }
        .preview {
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }

  .nullstate {
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
</style>
