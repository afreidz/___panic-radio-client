<script>
  import { createEventDispatcher } from 'svelte';
  import PanicModal from 'Components/Modal/Modal';
  import PanicAvatar from 'Components/Avatar/Avatar';

  export let area = null;
  export let members = [];
  export let member = false;
  export let canjoin = false;

  const dispatch = createEventDispatcher();

  function handleclick(existing = {}) {
    const props = { open: false };
    let trigger = () => {};

    if (!canjoin) {
      props.open = true;
      props.label = 'ok';
      props.title = "You can't DJ just yet!";
      props.content = 'How about adding some items to your crate first?';
      trigger = () => dispatch('crate');
    }

    if (existing) {
      props.open = true;
      props.label = 'yes';
      props.title = 'Leave the DJ Booth?';
      props.content = 'Do you want to leave the DJ booth?';
      trigger = () => dispatch('leave');
    }

    if (props.open) {
      const modal = new PanicModal({ intro: true, target: document.body, props });
      modal.$on('close', () => modal.$destroy());
      modal.$on('trigger', trigger);
    } else if (!existing) {
      dispatch('join');
    }
  }
</script>

<ul style="grid-area: {area}">
  {#each members as member, i}
    <li>
      <PanicAvatar user={member} showphoto={!!member} click={() => handleclick(member)} />
    </li>
  {/each}
</ul>

<style lang="less">
  @import 'source/Styles/index';

  ul {
    width: 100%;
    height: 2rem;
    background: @booth-background;
    display: flex;
    justify-content: space-around;
    align-items: center;
    li {
      width: 1rem;
      height: 1rem;
    }
  }
</style>
