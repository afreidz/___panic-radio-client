import { derived } from 'svelte/store';
import { socket, currentuser } from 'App/Store';
import { items as crate } from 'Components/Crate/Store';

export const djs = derived([socket, currentuser], ([$socket, $currentuser], set) => {
  $socket.onhostmessage('dj-update', data => set(data.djs));
}, []);

export const request = derived([socket, crate], ([$socket, $crate], set) => {
  $socket.onhostmessage('request', () => {
    const song = $crate.shift();
    // crate.set($crate);
    if (!!song) $socket.sendhost({ type: 'play', song });
  });
}, false);