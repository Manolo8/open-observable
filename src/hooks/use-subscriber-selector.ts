import { Subscriber } from '../types/subscriber';
import { useEffect, useState } from 'react';

export const useSubscriberSelector = <T, V>(
    subscriber: Subscriber<T>,
    selector: (value: T, prev: T | undefined) => V
): V => {
    const [value, setValue] = useState(() => selector(subscriber.value(), undefined));

    useEffect(() => subscriber.subscribe((value, prev) => setValue(selector(value, prev)), false), []);

    return value;
};