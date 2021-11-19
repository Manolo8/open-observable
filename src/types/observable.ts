import { Subscriber } from './subscriber';

export type Observable<T> = {
    dispatch: (value: T | ((prevState: T) => T)) => void;
    subscriber: Subscriber<T>;
};