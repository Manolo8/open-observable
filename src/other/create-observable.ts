import { Callback } from '../types/callback';
import { Observable } from '../types/observable';
import { Equality } from '../types/equality';

export const createObservable = <T>(initial: T, equality: Equality | null = null): Observable<T> => {
    const watching = [] as Callback<T>[];
    let value = initial;

    return {
        subscriber: {
            subscribe: (callback, flushFirst = true) => {
                watching.push(callback);

                if (flushFirst) callback(value, undefined);

                return () => watching.splice(watching.indexOf(callback), 1);
            },
            value: () => value,
        },
        dispatch: (dispatchValue) => {
            const newValue =
                typeof dispatchValue === 'function' ? (dispatchValue as (prevState: T) => T)(value) : dispatchValue;

            if (equality) {
                if (equality(value, newValue)) {
                    return;
                }
            } else if (value === newValue) {
                return;
            }

            const prev = value;
            value = newValue;
            watching.forEach((x) => x(newValue, prev));
        },
    };
};