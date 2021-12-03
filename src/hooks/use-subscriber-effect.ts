import { CleanupCallback } from '../types/cleanup-callback';
import { useEffect } from 'react';
import { ISubscribable } from '../types/i-subscribable';

export const useSubscriberEffect = <T>(
    subscriber: ISubscribable<T>,
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
