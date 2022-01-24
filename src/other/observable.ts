import { Callback } from '../types/callback';
import { InitialValue } from '../types/initial-value';
import { CleanupCallback } from '../types/cleanup-callback';
import { ISubscriber } from '../types/i-subscriber';
import { Dispatch } from '../types/dispatch';

export class Observable<T> implements ISubscriber<T> {
    private _value: T;
    private _watching: Callback<T>[];

    constructor(initial: InitialValue<T>) {
        this._value = typeof initial === 'function' ? (initial as () => T)() : initial;
        this._watching = [];

        this.subscribe = this.subscribe.bind(this);
        this.next = this.next.bind(this);
        this.current = this.current.bind(this);
        this.asSubscriber = this.asSubscriber.bind(this);
    }

    public subscribe(callback: Callback<T>, ignoreFirst?: boolean): CleanupCallback {
        this._watching.push(callback);

        if (!ignoreFirst) callback(this._value, undefined);

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

    public asSubscriber(): ISubscriber<T> {
        return this as ISubscriber<T>;
    }

    public current(): T {
        return this._value;
    }

    public watchingCount() {
        return this._watching.length;
    }
}