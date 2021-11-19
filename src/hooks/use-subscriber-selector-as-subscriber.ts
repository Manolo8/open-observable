import { Subscriber } from '../types/subscriber';
import { useObservable } from './use-observable';
import { useEffect } from 'react';

export const useSubscriberSelectorAsSubscriber = <T, V>(
    subscriber: Subscriber<T>,
    selector: (value: T, prev: T | undefined) => V
): Subscriber<V> => {
    const observable = useObservable(() => selector(subscriber.value(), undefined));

    useEffect(() => subscriber.subscribe((value, prev) => observable.dispatch(selector(value, prev)), false), []);

    return observable.subscriber;
};