import { CleanupCallback } from '../types/cleanup-callback';
import { useEffect } from 'react';
import { ISubscribable } from '../types/i-subscribable';

export const useAnySubscriberChangeEffect = (
    observables: ISubscribable<any>[],
    callback: () => CleanupCallback | void
) => {
    useEffect(() => {
        let cleanup: CleanupCallback | void;

        const internalCallback = () => {
            if (cleanup) cleanup();

            cleanup = callback();
        };

        const clean = observables.map((x) => x.subscribe(internalCallback));

        return () => {
            clean.forEach((x) => x());
            if (cleanup) cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, ...observables]);
};
