<script>
  import { elevator } from './Store';

  let elevatorOpts = [
    {
      title: 'Easy Hits Florida',
      url: 'http://airspectrum.cdnstream1.com:8114/1648_128',
    },
    {
      title: 'BBC1 Radio',
      url: 'http://bbcmedia.ic.llnwd.net/stream/bbcmedia_radio1_mf_q',
    },
    { title: 'Ambiesphere', url: 'http://uk5.internet-radio.com:8347/;stream' },
    {
      title: 'Party Vibe Radio: Hip Hop',
      url: 'http://www.partyviberadio.com:8016/;stream/2',
    },
    {
      title: 'Radio Bloodstream',
      url: 'http://uk1.internet-radio.com:8294/live',
    },
    { title: 'MoveDaHouse', url: 'http://uk7.internet-radio.com:8000/;stream' },
    {
      title: 'Austin Blues Radio',
      url: 'http://ca10.rcast.net:8036/;stream/1',
    },
    {
      title: 'Party Vibe Music',
      url: 'http://uk6.internet-radio.com:8124/;stream',
    },
  ];
</script>

<section>
  <label>
    <select on:change={e => ($elevator = e.target.value)}>
      {#each elevatorOpts as e}
        <option selected={$elevator === e.url} value={e.url}>{e.title}</option>
      {/each}
    </select>
  </label>
</section>

<style lang="less">
  @import 'source/Styles/index';

  section {
    border-top: 2px solid @track-border-color;
  }

  select {
    -moz-appearance: none;
    -webkit-appearance: none;
    background: transparent;
    border: 1px solid @track-border-color;
    box-shadow: 0 0 0 1px @track-border-color;
    border-radius: @track-radius;
    flex: 1;
    color: @white;
    font-size: 0.5rem;
    padding: 0.5rem;
    outline: none;
    width: 100%;
  }
  label {
    display: flex;
    margin: 1rem;
    position: relative;
    &:hover select {
      border-color: @white;
      box-shadow: 0 0 0 1px transparent;
    }
    &:hover {
      &:after {
        color: @white;
      }
    }
  }
  label:after {
    content: '▾';
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 1.5rem;
    font-size: 1rem;
    display: grid;
    place-items: center;
    color: @track-border-color;
    pointer-events: none;
    margin-top: -0.125rem;
  }
</style>
