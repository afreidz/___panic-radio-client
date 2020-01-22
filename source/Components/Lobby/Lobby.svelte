<script>
  import PanicAvatar from 'Components/Avatar/Avatar';
  export let area = null;
  export let rooms = [];
</script>

<ul style="grid-area: {area}">
  {#each rooms as r}
    <li>
      <a href="/?room={r.name.toLowerCase()}">
        <em>
          <PanicAvatar user={r.nowplaying ? r.nowplaying.dj : null} />
        </em>
        <strong>{r.name}</strong>
        <span>{r.nowplaying || 'Nothing playing'}</span>
        <small>
          <span>Listeners:</span>
          {r.listeners}
        </small>
      </a>
    </li>
  {/each}
</ul>

<style lang="less">
  @import 'source/Styles/index';

  ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    align-self: start;
    justify-content: space-around;
  }

  li {
    min-width: unit(175px / @one-rem, rem);
    max-width: unit(200px / @one-rem, rem);
    min-height: unit(175px / @one-rem, rem);
    background: @room-bg;
    border-radius: @room-radius;
    box-shadow: @room-shadow;
    margin: 0.5rem;
    flex: 1;
  }

  em {
    width: 2rem;
    height: 2rem;
  }

  a,
  a:active,
  a:hover,
  a:visited {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    color: @room-color;
    text-decoration: none;
    padding: 0.25rem;
  }

  span {
    font-size: 0.4rem;
    opacity: 0.5;
    align-self: start;
  }

  small {
    font-size: 0.4rem;
    align-self: end;
    justify-self: end;
  }

  strong {
    font-size: 0.7rem;
  }
</style>
