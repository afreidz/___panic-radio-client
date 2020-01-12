import { votes } from 'Components/Avatar/Store';
import { derived, writable, get } from 'svelte/store';
import { socket, userid, photo, username } from 'App/Store';

export const listeners = derived([socket], ([$socket], set) => {
  let state = null;
  $socket.onhostmessage('listeners', data => {
    state = data.listeners;
    set(state);
  });
}, []);

export const me = derived([
  photo,
  votes,
  userid,
  username,
  listeners,
], ([
  $photo,
  $votes,
  $userid,
  $username,
  $listeners,
], set) => {
  let state = $listeners.find(l => l.id === Number($userid));
  if (!state) return;

  state.voted = !!$votes.find(v => v.listener === Number($userid));
  set(state);
}, {});

export const listenerdetails = writable(get(me));