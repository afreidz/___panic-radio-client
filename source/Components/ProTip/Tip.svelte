<article style="grid-area: {area};">
  {#if size !== 'small'}
  <h3>😨{type}</h3>
  {:else}
  <h4>😨{type}</h4>
  {/if}
  <p class={size}>{tip}</p>
</article>

<style lang="less">
  @import 'source/Styles/index';
  article {
    padding: 0.5rem;
    background: rgba(255,255,255,0.1);
  }
  h3 {
    font-family: 'Montserrat';
    font-weight: 800;
    margin: 0 auto 0.25rem auto;
  }
  h4 {
    font-family: 'Montserrat';
    font-size: unit(14px/@one-rem, rem);
    font-weight: 600;
  }
  p {
    line-height: 1.6;
    font-weight: 300;
    text-align: justify;
    font-size: unit(16px/@one-rem, rem);
    &.small {
      font-size: unit(12px/@one-rem, rem);
    }
  }
</style>

<script>
  export let tip = '';
  export let area = null;
  export let size = 'small';
  export let type = "PRO TIP:";
</script>