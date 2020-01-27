import { socket } from 'App/Store';
import { get, writable } from 'svelte/store';
import { persistantWritable } from 'Utilities/storehelpers';

export const muted = writable(false);
export const current = writable(null);
export const elevator = persistantWritable(
  'elevator',
  'http://uk7.internet-radio.com:8000/;stream',
);

export const tracks = (() => {
  const { set, update, subscribe } = writable([]);
  const ws = get(socket);
  let queue = [];

  if (ws.onready) {
    ws.onready(() => {
      ws.onhostmessage('song', data => {
        if (data.queue) {
          queue = data.queue;
        } else if (data.song) {
          queue.push(data.song);
        }
        set(queue);
      });
    });
  }

  return {
    set,
    update,
    subscribe,
    reset() {
      queue = [];
      set(queue);
      return this;
    },
  };
})();
