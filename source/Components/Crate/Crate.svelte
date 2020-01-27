<script>
  import { tick } from 'svelte';
  import Sortable from 'sortablejs';
  import { openviews } from 'App/Store';
  import { items, preview } from './Store';
  import modal from 'Components/Modal/Store';
  import { createEventDispatcher } from 'svelte';
  import PanicProTip from 'Components/ProTip/Tip';
  import { autoplay } from 'Components/Booth/Store';
  import PanicButton from 'Components/Button/Button';
  import PanicHolder from 'Components/Button/Holder';

  $: {
    if ($items.length && crateitems)
      new Sortable(crateitems, {
        sort: true,
        onUpdate: save,
        handle: '.sorter',
      });
    if (!$items.length && searchButton) {
      dispatch('close');
      searchButton.click();
    }
    if (confirm) {
      modal.update(m => {
        m.content = `You are about to remove ${
          $items.filter(i => i.selected).length
        } songs from your crate.`;
        m.cancel = () => (confirm = false);
        m.title = 'Are you sure?';
        m.action = trash;
        m.label = 'Yes';
        m.open = true;
        return m;
      });
    }
  }

  let dispatch = createEventDispatcher();
  let allselected = false;
  let edittimer = null;
  let editing = false;
  let confirm = false;
  let active = null;
  let searchButton;
  let crateitems;

  function save(e) {
    $items = move($items, e.oldIndex, e.newIndex);
  }

  function move(arr, oldIndex, newIndex) {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      while (k--) arr.push(undefined);
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
  }

  function selectall() {
    allselected = !allselected;
    $items = $items.map(i => ({ ...i, selected: allselected }));
  }

  async function trash() {
    const removed = $items.filter(i => i.selected);
    const newCrate = $items.filter(i => !i.selected);
    $items = newCrate;
    confirm = false;
    editing = false;
  }

  function previewtrack(url) {
    $preview = url;
    openviews.add('preview');
  }
</script>

<div class="crate" class:editing>
  {#if editing}
    <button class="trash" on:click={() => (confirm = true)}>🗑️</button>
    <button class="selectall" on:click={selectall}>✅</button>
    <button class="done" on:click={() => (editing = false)}>👍</button>
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
    <button
      class="search"
      bind:this={searchButton}
      on:click={() => openviews.add('search')}>
      🔍
    </button>
  {/if}
  <div class="content">
    {#if !$items.length}
      <div class="nullstate">
        <p>
          <span>
            You have {$items.length} song
            {#if $items.length !== 1}s{/if}
            in your crate.
          </span>
          <small>Search to add more</small>
        </p>
      </div>
    {:else}
      <ul class="items" bind:this={crateitems}>
        {#each $items as entry, i (entry.media)}
          <li>
            <PanicHolder on:hold={() => (editing = true)}>
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
                  <button
                    class="preview"
                    on:click={() => previewtrack(entry.preview)}>
                    ▶️
                  </button>
                  <p>
                    <strong>
                      {@html entry.title}
                    </strong>
                    <em>
                      {@html entry.artist}
                    </em>
                  </p>
                  <button class="placeholder">
                    <span>☰</span>
                  </button>
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
