import { useEffect, useState } from 'react';
import { ISubscribable } from '../types/i-subscribable';

export const useSubscriber = <T>(subscriber: ISubscribable<T>): T => {
    const [value, setValue] = useState(subscriber.current());

    useEffect(() => subscriber.subscribe(setValue), [subscriber]);

    return value;
};
