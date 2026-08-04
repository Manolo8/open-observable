import { useEffect, useState } from 'react';
import { ISubscriber } from '../types/i-subscriber';

export function useSubscriber<T>(subscriber: ISubscriber<T>): T {
    //the lazy initializer and the wrapped setter keep function values intact
    const [value, setValue] = useState<T>(() => subscriber.current());

    useEffect(() => subscriber.subscribe((value) => setValue(() => value)), [subscriber]);

    return value;
}
