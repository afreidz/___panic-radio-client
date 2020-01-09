import { socket } from 'App/Store';
import { writable, derived } from 'svelte/store';
import { persistantWritable } from 'Utilities/storehelpers';

export const preview = writable(null);
export const items = persistantWritable('crate', []);

export const results = derived([socket], ([$socket], set) => {
  $socket.onhostmessage('searchresults', data => {
    set({ ...data.results });
  });
}, {
  yt: [],
  sc: [],
  bc: [],
});