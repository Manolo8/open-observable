import { useEffect, useState } from 'react';
import { ISubscribable } from '../types/i-subscribable';

export const useSubscriberSelector = <T, V>(
    subscriber: ISubscribable<T>,
    selector: (value: T, prev: T | undefined) => V
): V => {
    const [value, setValue] = useState(() => selector(subscriber.current(), undefined));

    useEffect(() => subscriber.subscribe((value, prev) => setValue(selector(value, prev)), false), [selector, subscriber]);

    return value;
};
