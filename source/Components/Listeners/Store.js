import { socket, userid } from 'App/Store';
import { votes } from 'Components/Avatar/Store';
import { derived, writable, get } from 'svelte/store';

export const listeners = derived(
  [socket],
  ([$socket], set) => {
    let state = null;
    $socket.onhostmessage('listeners', (data) => {
      state = data.listeners;
      set(state);
    });
  },
  [],
);

export const me = derived(
  [votes, userid, listeners],
  ([$votes, $userid, $listeners], set) => {
    const state = $listeners.find((l) => l.id === Number($userid));
    if (!state) return;

    state.voted = !!$votes.find((v) => v.listener === Number($userid));
    set(state);
  },
  {},
);

export const listenerdetails = writable(get(me));
