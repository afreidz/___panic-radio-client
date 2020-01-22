import { writable } from 'svelte/store';
import { persistantSet } from 'Utilities/storehelpers';

export const open = writable(false);
export const pinned = persistantSet('pinned');
