import { writable } from 'svelte/store';

export default writable({
  open: null,
  label: null,
  title: null,
  theme: null,
  cancel: null,
  content: null,
  action: () => { },
});