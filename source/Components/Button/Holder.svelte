<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const delay = 400;
  let timer;

  function starthold(e) {
    timer = setTimeout(() => {
      e.preventDefault();
      timer = null;
      dispatch('hold');
    }, delay);
  }

  function endhold() {
    if (!timer) return true;
    clearTimeout(timer);
    dispatch('default');
    return true;
  }
</script>

<button
  on:mouseup={endhold}
  on:touchend={endhold}
  on:mousedown={starthold}
  on:touchstart={starthold}>
  <slot />
</button>

<style>
  button {
    padding: 0;
    width: 100%;
    border: none;
    outline: none;
    background: none;
  }
</style>
