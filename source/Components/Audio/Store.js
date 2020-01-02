import { socket, room } from 'App/Store';
import { get, writable, derived } from 'svelte/store';

export const muted = writable(true);
export const audio = writable(null);
export const tracks = createTrackStore();
export const elevator = writable('http://uk7.internet-radio.com:8000/;stream');
export const current = writable({ src: get(elevator) });

function createTrackStore() {
  const $socket = get(socket);
  const { subscribe, set } = writable([]);
  let state = [];

  $socket.onhostmessage('status', msg => {
    if (!msg.down) state.push({
      id: msg.id,
      dj: msg.dj,
      src: msg.src,
      played: false,
      title: msg.title,
      artist: msg.artist,
      elapsed: msg.elapsed,
      duration: msg.duration,
      remaining: msg.remaining,
    });
    set(state);
  });

  return {
    subscribe,
    set(val) {
      state = val;
      return set(state);
    },
  }
}
