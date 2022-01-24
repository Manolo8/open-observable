import { Callback } from './callback';
import { CleanupCallback } from './cleanup-callback';

export interface ISubscriber<T> {
    current: () => T;
    subscribe: (callback: Callback<T>, ignoreFirst?: boolean) => CleanupCallback;
}