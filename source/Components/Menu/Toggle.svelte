<script>
  export let area = null;
</script>

<a href="#menu" on:click|preventDefault style="grid-area: {area};">☰</a>

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
  }
</style>
