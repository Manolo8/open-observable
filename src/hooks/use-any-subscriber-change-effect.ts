import { ISubscriber } from '../types/i-subscriber';
import { CleanupCallback } from '../types/cleanup-callback';
import { useEffect } from 'react';

export function useAnySubscriberChangeEffect(
    observables: ISubscriber<any>[],
    callback: () => CleanupCallback | void
): void {
    useEffect(() => {
        let cleanup: CleanupCallback | void;

        const internalCallback = () => {
            if (cleanup) cleanup();

            cleanup = callback();
        };

        const clean = observables.map((x) => x.subscribe(internalCallback, true));

        //first
        internalCallback();

        return () => {
            clean.forEach((x) => x());
            if (cleanup) cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, ...observables]);
}
