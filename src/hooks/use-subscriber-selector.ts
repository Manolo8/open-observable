import { useEffect, useState } from 'react';
import { ISubscriber } from '../types/i-subscriber';

export function useSubscriberSelector<T, V>(
    subscriber: ISubscriber<T>,
    selector: (value: T, prev: T | undefined) => V
): V {
    const [value, setValue] = useState<V>(() => selector(subscriber.current(), undefined));

    useEffect(
        //the wrapped setter keeps function values intact
        () => subscriber.subscribe((value, prev) => setValue(() => selector(value, prev)), false),
        [selector, subscriber]
    );

    return value;
}
