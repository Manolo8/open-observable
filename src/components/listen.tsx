import React from 'react';
import { ReactNode, useMemo } from 'react';
import { useSubscriber } from '../hooks/use-subscriber';
import { ISubscriber } from '../types/i-subscriber';

interface Props<T> {
    subscriber: ISubscriber<T>;
    children: (value: T) => ReactNode;
}

export function Listen<T>({ subscriber, children }: Props<T>) {
    const value = useSubscriber(subscriber);

    return <>{useMemo(() => children(value), [children, value])}</>;
}
