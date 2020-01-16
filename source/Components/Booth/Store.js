import { derived } from 'svelte/store';
import Notifier from 'Utilities/notify';
import { socket, room } from 'App/Store';
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

export const request = derived([socket, room], ([$socket, $room], set) => {
  let notifier = new Notifier();
  let timer;

  $socket.onhostmessage('request', async data => {
    set(true);
    let note = await notifier.notify('Heads up!', `It is your turn to DJ in "${$room}"`);
    timer = setTimeout(() => {
      set(false);
      note.close();
      notifier.notify('Time is up!', `You are no longer a DJ in "${$room}"`)
    }, data.time);
    request.respond = song => {
      set(null);
      clearTimeout(timer);
      $socket.sendhost({ type: 'play', song });
    };
  });
}, null);