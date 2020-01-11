<progress value={$progress} max={duration}></progress>
<section>
  <pre>{startTime}</pre>
  <pre>{durationTime}</pre>
</section>

<style lang="less">
  @import 'source/Styles/index';

  progress {
    -webkit-appearance: none;
    width: 100%;
    height: @progress-thickness;
    text-align: left;

    &[value]::-webkit-progress-bar{
      background: @progress-bg;
    }
    &[value]::-webkit-progress-value{
      background: @progress-fg;
    }
  }

  section {
    display: flex;
    justify-content: flex-start;
    padding: 0.25rem;
  }

  pre {
    flex: 1;
    text-align: left;
    font-size: unit(11px/@one-rem, rem);
    &:last-child {
      justify-self: flex-end;
      text-align: right;
    }
  }
</style>

<script>
  import moment from 'moment';
  import { tweened } from 'svelte/motion';

  export let start = 0;
  export let duration = Infinity;

  const interval = 1000;
  const progress = tweened(start, { duration: interval });
  
  let timer;
  let startTime;
  let durationTime;

  $: startTime = formatTime($progress * 1000);
  $: durationTime = formatTime(duration * 1000);

  timer = setInterval(() => {
    progress.update(p => p+=1);
    if($progress >= duration) clearInterval(timer);
  }, interval);

  function formatTime(ms){
    const d = moment.duration(ms)
    const h = `${d.hours()}`.padStart(2,'0');
    const m = `${d.minutes()}`.padStart(2, '0');
    const s = `${d.seconds()}`.padStart(2,'0');
    if(isNaN(h) || isNaN(m) || isNaN(s)) return `∞`;
    return `${h}:${m}:${s}`;
  }
</script>