import { socket } from 'App/Store';
import { writable, derived } from 'svelte/store';
import { persistantWritable } from 'Utilities/storehelpers';

export const query = writable(null);
export const preview = writable(null);
export const items = persistantWritable('crate', []);

export const results = derived([socket], ([$socket], set) => {
  $socket.onhostmessage('searchresults', data => {
    set({ ...data.results });
  });
  results.reset = () => {
    set({ yt: [], sc: [], bc: [] });
  }
}, { yt: [], sc: [], bc: [] });

export const loading = derived([results, query], ([$results, $query], set) => {
  set(!!$query && Object.values($results).every(v => v.length === 0));
  loading.force = (v = false) => set(v);
}, false);