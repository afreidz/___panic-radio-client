<script>
  import moment from 'moment';
  import { username, photo } from 'App/Store';
  import { createEventDispatcher } from 'svelte';
  import PanicProTip from 'Components/ProTip/Tip';
  import PanicInput from 'Components/Input/Input';
  import PanicHolder from 'Components/Button/Holder';
  import PanicAvatar from 'Components/Avatar/Avatar';

  export let listener = {};
  export let editable = false;

  const dispatch = createEventDispatcher();
  let photoedit = false;
  let nameedit = false;

  function nameeditdone(e) {
    const { username: un } = e.target.elements;
    if (un.value !== $username) $username = un.value;
    listener.name = un.value;
    nameedit = false;
  }

  function time(ms) {
    const start = moment();
    const end = moment(ms);
    return moment.duration(start - end).humanize();
  }

  function photoeditdone(e) {
    const { newphoto } = e.detail;
    if (newphoto) $photo = newphoto;
    listener.photo = newphoto;
    photoedit = false;
  }
</script>

<div class="details">
  <button class="close" on:click={() => dispatch('close')}>✕</button>
  <main>
    <figure>
      {#if editable}
        <PanicHolder
          on:hold={() => {
            photoedit = true;
          }}>
          <PanicAvatar
            user={listener}
            editing={photoedit}
            on:editdone={photoeditdone}
            showvote={false} />
        </PanicHolder>
      {:else}
        <PanicAvatar user={listener} />
      {/if}
    </figure>
    <caption>
      <strong>
        <span class="key">Listener:</span>
        {#if nameedit}
          <form on:submit|preventDefault={nameeditdone}>
            <PanicInput
              focus={true}
              minlength={3}
              maxlength={18}
              name="username"
              pattern="[A-Za-z0-9_/.-]+"
              placeholder="anon_{listener.id}"
              value={listener.name} />
            <button type="submit">👍</button>
          </form>
        {:else}
          <span
            class="value"
            on:click={() => {
              nameedit = true;
            }}>
            {listener.name}
          </span>
        {/if}
      </strong>
      <small>
        <span class="key">Listening:</span>
        <span class="value">{time(listener.id)}</span>
      </small>
      <hr />
    </caption>
    <ul>
      <li>
        <i>💿</i>
        <span class="value">{(listener.score && listener.score.plays) || 0}</span>
        <span class="key">songs played</span>
      </li>
      <li>
        <i>🎖️</i>
        <span class="value">{(listener.score && listener.score.rank) || 0}</span>
        <span class="key">score</span>
      </li>
    </ul>
  </main>
  {#if editable}
    <PanicProTip
      type="ProTip!"
      tip={'Click and hold on your avatar to change your photo. <br> Click your username to edit it.'} />
  {/if}
</div>

<style lang="less">
  @import 'source/Styles/index';

  .details {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: absolute;
    background: @view-bg;
  }

  main {
    width: 100%;
    height: 100%;
    grid-area: main;
    display: grid;
    grid-template-rows: unit(200px / @one-rem, rem) 4rem auto;
    grid-template-areas:
      'photo'
      'details'
      'stats';
    background: rgba(0, 0, 0, 0.3);
  }

  form {
    position: relative;
    display: inline-block;
    button {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 2rem;
      border: none;
      background: none;
      outline: none;
    }
  }

  hr {
    width: unit(200px / @one-rem, rem);
    border: none;
    height: 1px;
    background: @rule;
    margin: 1rem 0;
  }

  figure {
    width: 100%;
    height: 100%;
    grid-area: photo;
    max-width: unit(150px / @one-rem, rem);
    max-height: unit(150px / @one-rem, rem);
    align-self: center;
    justify-self: center;
  }
  caption {
    grid-area: details;
    strong {
      font-size: 1rem;
      display: block;
      line-height: 1rem;
      .key {
        font-size: 0.6em;
      }
    }
    small {
      font-size: 0.5rem;
      display: block;
      line-height: 1rem;
      .key {
        font-weight: 400;
        font-size: 0.8em;
      }
      .value {
        opacity: 0.3;
      }
    }
    .key {
      color: @view-highlight;
      text-transform: uppercase;
      line-height: 1rem;
    }
  }
  ul {
    grid-area: stats;
    display: flex;
    margin-top: 1rem;
  }
  li {
    flex-grow: 1;
    text-align: center;
    width: 50%;
    i,
    .key,
    .value {
      display: block;
    }
    i {
      font-size: 2rem;
    }
    .value {
      font-family: 'Montserrat';
      font-weight: 600;
      color: @view-highlight;
      margin: 0.25rem 0;
    }
    .key {
      font-size: 0.4rem;
      opacity: 0.3;
    }
  }

  .close {
    border: none;
    background: none;
    outline: none;
    font-size: 1rem;
    color: @view-color;
    background: rgba(0, 0, 0, 0.3);
    width: 2rem;
    height: 2rem;
    flex-grow: 0;
    flex-shrink: 0;
  }
</style>
