<button 
  disabled={disabled}
  type={behavior}
  class={type}
  on:click
>
  <slot></slot>
</button>

<style lang="less">
  @import 'source/Styles/index';

  button {
    background: @button-bg;
    border: 2px solid @button-bg;
    line-height: @button-height;
    width: 100%;
    border-radius: @button-radius;
    color: @button-color;
    font-weight: 800;
    text-align: center;
    outline: none;
    font-size: unit(14px/@one-rem, rem);
    cursor: pointer;
    box-shadow: @button-shadow;
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    margin-bottom: unit(10px/@one-rem, rem);

    &:hover {
      box-shadow: @button-hover-shadow;
    }

    &.transparent {
      background: none;
      box-shadow: none;
      color: @button-bg;
      opacity: 0.7;

      &:hover {
        box-shadow: none;
        opacity: 1;
      }
    }

    &.text {
      border: none;
      outline: none;
      text-align: center;
      color: @white;
      font-weight: bold;
      text-transform: uppercase;
      background: none;
      font-size: unit(12px/@one-rem, rem);
      box-shadow: none;
      &:hover {
        box-shadow: none;
      }
    }
  }
</style>

<script>
  export let type = null;
  export let disabled = false;
  export let behavior = 'button';
</script>