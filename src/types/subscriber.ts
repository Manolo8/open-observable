import { CleanupCallback } from './cleanup-callback';
import { Callback } from './callback';

export type Subscriber<T> = {
    value: () => T;
    subscribe: (callback: Callback<T>, flushFirst?: boolean) => CleanupCallback;
};