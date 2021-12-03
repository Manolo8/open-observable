import { Callback } from './callback';
import { CleanupCallback } from './cleanup-callback';

export interface ISubscribable<T> {
    current: () => T;
    subscribe: (callback: Callback<T>, flushFirst?: boolean) => CleanupCallback;
}