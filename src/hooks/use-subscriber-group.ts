import { useCallback } from 'react';
import { ISubscriber } from '../types/i-subscriber';
import { useAnySubscriberChangeEffect } from './use-any-subscriber-change-effect';
import { useObservable } from './use-observable';

export function useSubscriberGroup<A, B>(value1: ISubscriber<A>, value2: ISubscriber<B>): ISubscriber<[A, B]>;
export function useSubscriberGroup<A, B, C>(
    value1: ISubscriber<A>,
    value2: ISubscriber<B>,
    value3: ISubscriber<C>
): ISubscriber<[A, B, C]>;
export function useSubscriberGroup<A, B, C, D>(
    value1: ISubscriber<A>,
    value2: ISubscriber<B>,
    value3: ISubscriber<C>,
    value4: ISubscriber<D>
): ISubscriber<[A, B, C, D]>;
export function useSubscriberGroup<A, B, C, D, E>(
    value1: ISubscriber<A>,
    value2: ISubscriber<B>,
    value3: ISubscriber<C>,
    value4: ISubscriber<D>,
    value5: ISubscriber<E>
): ISubscriber<[A, B, C, D, E]>;

export function useSubscriberGroup(...observables: ISubscriber<any>[]): ISubscriber<any[]> {
    const values = useObservable(() => observables.map((x) => x.current()));

    useAnySubscriberChangeEffect(
        observables,
        useCallback(
            (changedIndex) => {
                if (changedIndex === -1) {
                    //re-sync on mount, anything changed between the first render and this effect would be lost
                    values.next((old) => {
                        const current = observables.map((x) => x.current());

                        if (current.length === old.length && current.every((x, i) => x === old[i])) return old;

                        return current;
                    });

                    return;
                }

                values.next((old) => {
                    const copy = [...old];

                    copy[changedIndex] = observables[changedIndex].current();

                    return copy;
                });
            },
            [observables, values]
        )
    );

    return values.asSubscriber();
}
