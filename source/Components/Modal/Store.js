import { writable } from 'svelte/store';

export default writable({
  open: null,
  label: null,
  title: null,
  action: null,
  cancel: null,
  content: null,
});