import { writable } from 'svelte/store';
import { createPersistantSet } from 'Utilities/persistentstore';

export const open = writable(false);
export const pinned = createPersistantSet('pinned');