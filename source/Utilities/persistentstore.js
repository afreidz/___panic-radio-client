import { writable } from 'svelte/store';

export default function createPersistantWritable(key, initial) {
  const json = window.localStorage.getItem(key);
  const { subscribe, set, update } = writable(json ? JSON.parse(json) : initial);

  (() => {
    const json = window.localStorage.getItem(key);
    if (json) {
      set(JSON.parse(json));
    }
    subscribe(current => {
      window.localStorage.setItem(key, JSON.stringify(current));
    });
  })();

  return {
    set,
    update,
    subscribe,
  }
}

export function createPersistantSet(key) {
  const localset = new Set;
  const json = window.localStorage.getItem(key);
  if (json) JSON.parse(json).forEach(i => localset.add(i));
  const { subscribe, set, update } = writable(localset);

  (() => {
    const json = window.localStorage.getItem(key);
    if (json) JSON.parse(json).forEach(i => localset.add(i));
    set(localset);

    subscribe(current => {
      window.localStorage.setItem(key, JSON.stringify([...current]));
    });
  })();

  return {
    set,
    update,
    subscribe,
    add(i) {
      localset.add(i);
      set(localset);
    },
    delete(i) {
      localset.delete(i);
      set(localset);
    },
    has: localset.has.bind(localset),
  }
}