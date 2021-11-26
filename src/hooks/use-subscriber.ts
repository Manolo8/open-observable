import {Subscriber} from '../types/subscriber';
import {useEffect, useState} from 'react';

export const useSubscriber = <T>(subscriber: Subscriber<T>): T => {
    const [value, setValue] = useState(subscriber.value());

    useEffect(() => subscriber.subscribe(setValue), []);

    return value;
};