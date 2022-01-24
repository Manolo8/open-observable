import { useObservable } from './use-observable';
import { useEffect } from 'react';
import { ISubscriber } from '../types/i-subscriber';

export const useSubscriberSelectorAsSubscriber = <T, V>(
    subscriber: ISubscriber<T>,
    selector: (value: T, prev: T | undefined) => V
): ISubscriber<V> => {
    const observable = useObservable<V>(() => selector(subscriber.current(), undefined));

    useEffect(
        () => subscriber.subscribe((value, prev) => observable.next(selector(value, prev))),
        [observable, selector, subscriber]
    );

    return observable.asSubscriber();
};
