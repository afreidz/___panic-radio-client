import { socket } from 'App/Store';
import { derived } from 'svelte/store';
import storehelpers from 'Utilities/storehelpers';
import { listeners } from 'Components/Listeners/Store';

export const autoplay = storehelpers.persistantWritable('autoplay', false);

export const djs = derived([socket, listeners], ([$socket, $listeners], set) => {
  $socket.onhostmessage('djs', data => {
    const djs = [];
    data.djs.forEach(dj => {
      const listener = $listeners.find(l => l.id === dj);
      if (listener) djs.push(listener);
    });
    set(djs);
  });
}, []);

export const request = derived([socket], ([$socket], set) => {
  let timer;
  $socket.onhostmessage('request', data => {
    set(true);
    timer = setTimeout(() => set(false), data.time);
    request.respond = song => {
      set(null);
      clearTimeout(timer);
      $socket.sendhost({ type: 'play', song });
    };
  });
}, null);