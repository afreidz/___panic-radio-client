import { socket } from 'App/Store';
import { derived } from 'svelte/store';
import { listeners } from 'Components/Listeners/Store';

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