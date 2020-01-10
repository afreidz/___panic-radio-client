import { derived } from 'svelte/store';
import { socket, userid } from 'App/Store';
import { votes } from 'Components/Avatar/Store';

export const listeners = derived([socket], ([$socket], set) => {
  let state = null;
  $socket.onhostmessage('listeners', data => {
    state = data.listeners;
    set(state);
  });
}, []);

export const me = derived([userid, listeners, votes], ([$userid, $listeners, $votes], set) => {
  let state = $listeners.find(l => l.id === $userid);
  state.voted = !!$votes.find(v => v.listener === $userid);
  set(state);
}, {});