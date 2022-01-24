import { useEffect, useState } from 'react';
import { ISubscriber } from '../types/i-subscriber';

export const useSubscriber = <T>(subscriber: ISubscriber<T>): T => {
    const [value, setValue] = useState(subscriber.current());

    useEffect(() => subscriber.subscribe(setValue), [subscriber]);

    return value;
};
