import { useEffect, useRef } from 'react';
import { CleanupCallback } from '../types/cleanup-callback';
import { ISubscriber } from '../types/i-subscriber';

export function useAnySubscriberChangeEffect(
    observables: ISubscriber<any>[],
    callback: (changedIndex: number) => CleanupCallback | void
): void {
    //the subscribers are spread into the dependency list, so react requires a constant count
    const count = useRef(observables.length);

    if (count.current !== observables.length) {
        throw new Error('useAnySubscriberChangeEffect: the number of subscribers must be constant across renders');
    }

    useEffect(() => {
        let cleanup: CleanupCallback | void;

        const internalCallback = (changedIndex: number) => {
            if (cleanup) cleanup();

            cleanup = callback(changedIndex);
        };

        const clean = observables.map((x, i) => x.subscribe(() => internalCallback(i), true));

        //first
        internalCallback(-1);

        return () => {
            clean.forEach((x) => x());
            if (cleanup) cleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, ...observables]);
}
