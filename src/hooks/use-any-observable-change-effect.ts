import { CleanupCallback } from '../types/cleanup-callback';
import { useEffect } from 'react';
import { Subscriber } from '../types/subscriber';

export const useAnyObservableChangeEffect = (
    observables: Subscriber<any>[],
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
    }, observables);
};