import { socket, currentuser } from 'App/Store';
import { writable, get, derived } from 'svelte/store';

export const listeners = derived([socket, currentuser], ([$socket, $currentuser], set) => {
  $socket.onhostmessage('listener-update', data => set(data.listeners));
}, []);