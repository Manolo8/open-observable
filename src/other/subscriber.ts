import { Callback } from '../types/callback';
import { CleanupCallback } from '../types/cleanup-callback';
import { Observable } from './observable';
import { ISubscribable } from '../types/i-subscribable';

export class Subscriber<T> implements ISubscribable<T> {
    private readonly observable: Observable<T>;

    constructor(observable: Observable<T>) {
        this.observable = observable;
    }

    public subscribe(callback: Callback<T>, flushFirst?: boolean): CleanupCallback {
        return this.observable.subscribe(callback, flushFirst);
    }

    public current(): T {
        return this.observable.current();
    }
}
