import { Subscriber } from '../types/subscriber';
import { CleanupCallback } from '../types/cleanup-callback';
import { useEffect } from 'react';

export const useSubscriberEffect = <T>(
    subscriber: Subscriber<T>,
    callback: (value: T, prevValue: T | undefined) => CleanupCallback | void
): void => {
    useEffect(() => {
        let lastCleanup: CleanupCallback | void;

        const cleanup = subscriber.subscribe((value, prev) => {
            if (lastCleanup) lastCleanup();

            lastCleanup = callback(value, prev);
        });

        return () => {
            cleanup();
            if (lastCleanup) lastCleanup();
        };
    }, [subscriber, callback]);
};