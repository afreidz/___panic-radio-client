import { socket } from 'App/Store';
import { derived } from 'svelte/store';

export const listeners = derived([socket], ([$socket], set) => {
  $socket.onhostmessage('listeners', data => set(data.listeners));
}, []);