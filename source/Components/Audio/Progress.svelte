<div class="container">
  <div class:running={!!run} class="bar" style="animation-duration: {time - start}s; transform: scaleX({start/time});"></div>
</div>

<style lang="less">
  @import 'source/Styles/index.less';

  @keyframes progress {
    to { transform: scaleX(1); }
  }

  .container {
    display: inline-block;
    width: 100%;
    height: @progress-thickness;
    font-size: 0;
    background: @progress-bg;
    overflow: hidden;
  }
  .bar {
    width: 100%;
    height: 100%;
    background: @progress-fg;
    transform: scaleX(0);
    transform-origin: center left;
    animation-name: progress;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
    animation-play-state: paused;
  }
  .running{
    animation-play-state: running;
  }
</style>

<script>
  export let time = 0;
  export let run = false;
  export let start = 0;
</script>

