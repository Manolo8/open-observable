import { useObservable } from './use-observable';
import { useEffect } from 'react';
import { ISubscribable } from '../types/i-subscribable';

export const useSubscriberSelectorAsSubscriber = <T, V>(
    subscriber: ISubscribable<T>,
    selector: (value: T, prev: T | undefined) => V
): ISubscribable<V> => {
    const observable = useObservable<V>(() => selector(subscriber.current(), undefined));

    useEffect(
        () => subscriber.subscribe((value, prev) => observable.next(selector(value, prev))),
        [observable, selector, subscriber]
    );

    return observable.toSubscriber();
};
