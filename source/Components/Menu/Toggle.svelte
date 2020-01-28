<script>
  import { open } from './Store';
  
  export let area = null;
</script>

<a
  href="#menu"
  class:open={!!$open}
  on:click|preventDefault
  style="grid-area: {area};">
  {#if !!$open}✕{:else}☰{/if}
</a>

<style lang="less">
  @import 'source/Styles/index';

  a,
  a:active,
  a:visited,
  a:hover {
    width: 100%;
    height: 100%;
    color: @main-page-font-color;
    text-decoration: none;
    display: grid;
    place-items: center;
    &.open {
      background: @menu-bg;
    }
  }
</style>
