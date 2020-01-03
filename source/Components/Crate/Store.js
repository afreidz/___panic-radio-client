import { writable } from 'svelte/store';
import { persistantWritable } from 'Utilities/storehelpers';

export const preview = writable(null);
export const items = persistantWritable('crate', []);