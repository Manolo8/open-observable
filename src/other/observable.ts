import { Callback } from '../types/callback';
import { InitialValue } from '../types/initial-value';
import { CleanupCallback } from '../types/cleanup-callback';
import { ISubscriber } from '../types/i-subscriber';
import { Dispatch } from '../types/dispatch';

export class Observable<T> implements ISubscriber<T> {
    private _value: T;
    private _watching: Callback<T>[];
    //how many dispatches are iterating _watching right now, nested ones included
    private _dispatching: number;

    constructor(initial: InitialValue<T>) {
        this._value = typeof initial === 'function' ? (initial as () => T)() : initial;
        this._watching = [];
        this._dispatching = 0;

        this.subscribe = this.subscribe.bind(this);
        this.next = this.next.bind(this);
        this.current = this.current.bind(this);
        this.asSubscriber = this.asSubscriber.bind(this);
    }

    public subscribe(callback: Callback<T>, ignoreFirst?: boolean): CleanupCallback {
        //a dispatch is iterating the array, copy it so the running loop keeps its snapshot
        if (this._dispatching > 0) this._watching = this._watching.slice();

        this._watching.push(callback);

        if (!ignoreFirst) callback(this._value, undefined);

        return () => {
            const index = this._watching.indexOf(callback);

            if (index < 0) return;

            if (this._dispatching > 0) this._watching = this._watching.slice();

            this._watching.splice(index, 1);
        };
    }

    public next(dispatchValue: Dispatch<T>) {
        const newValue =
            typeof dispatchValue === 'function' ? (dispatchValue as (prevState: T) => T)(this._value) : dispatchValue;

        if (this._value === newValue) {
            return;
        }

        const prev = this._value;
        this._value = newValue;

        const watching = this._watching;

        this._dispatching++;

        try {
            for (let i = 0; i < watching.length; i++) {
                watching[i](newValue, prev);
            }
        } finally {
            this._dispatching--;
        }
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