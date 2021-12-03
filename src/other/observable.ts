import { Callback } from '../types/callback';
import { InitialValue } from '../types/initial-value';
import { CleanupCallback } from '../types/cleanup-callback';
import { ISubscribable } from '../types/i-subscribable';
import { Dispatch } from '../types/dispatch';
import { Subscriber } from './subscriber';

export class Observable<T> implements ISubscribable<T> {
    private _value: T;
    private _watching: Callback<T>[];
    private _subscriber?: Subscriber<T>;

    constructor(initial: InitialValue<T>) {
        this._value = typeof initial === 'function' ? (initial as () => T)() : initial;
        this._watching = [];
    }

    public subscribe(callback: Callback<T>, flushFirst?: boolean): CleanupCallback {
        this._watching.push(callback);

        if (flushFirst) callback(this._value, undefined);

        return () => this._watching.splice(this._watching.indexOf(callback), 1);
    }

    public next(dispatchValue: Dispatch<T>) {
        const newValue =
            typeof dispatchValue === 'function' ? (dispatchValue as (prevState: T) => T)(this._value) : dispatchValue;

        if (this._value === newValue) {
            return;
        }

        const prev = this._value;
        this._value = newValue;
        this._watching.forEach((x) => x(newValue, prev));
    }

    public toSubscriber(): Subscriber<T> {
        if (!this._subscriber) {
            this._subscriber = new Subscriber<T>(this);
        }

        return this._subscriber;
    }

    public current(): T {
        return this._value;
    }
}