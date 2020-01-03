import { writable } from 'svelte/store';

export function persistantWritable(key, initial) {
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

export function persistantSet(key) {
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

export function writableSet() {
  const localstate = new Set;
  const { subscribe, set, update } = writable(localstate);

  return {
    set,
    update,
    subscribe,
    add: i => {
      localstate.add(i);
      update(() => (localstate));
    },
    delete: i => {
      localstate.delete(i);
      update(() => (localstate));
    },
    has: i => (localstate.has(i))
  };
}

export default {
  writableSet,
  persistantSet,
  persistantWritable,
}