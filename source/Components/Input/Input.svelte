{#if type === 'text'}
<input
  id={name}
  type="text"
  name={name}
  bind:this={input}
  pattern={pattern}
  bind:value={value}
  required={required}
  inputmode={inputmode}
  minlength={minlength}
  maxlength={maxlength}
  placeholder={placeholder}
  on:input
/>
{:else if type === 'password'}
<input
  id={name}
  name={name}
  type="password"
  bind:this={input}
  pattern={pattern}
  bind:value={value}
  required={required}
  inputmode={inputmode}
  minlength={minlength}
  maxlength={maxlength}
  placeholder={placeholder}
  on:input
/>
{/if}

<style lang="less">
  @import 'source/Styles/index';

  input {
    background: @input-bg;
    border-radius: @input-radius;
    color: @input-color;
    border: @input-border;
    line-height: @input-height;
    padding: 0 unit(20px/@one-rem, rem);
    margin-bottom: unit(10px/@one-rem, rem);
    width: 100%;
    font-size: unit(14px/@one-rem, rem);
    outline: none;

    &::placeholder {
      color: @input-color;
      opacity: 0.5;
    }
  }

</style>

<script>
  export let name;
  export let value = null;
  export let type = 'text';
  export let focus = false;
  export let pattern = null;
  export let required = false;
  export let inputmode = null;
  export let maxlength = null;
  export let minlength = null;
  export let placeholder = name || null;
  let input

  $: if(focus && input) input.focus(); 
</script>