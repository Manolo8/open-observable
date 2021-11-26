import React, { useCallback, VFC } from 'react';
import { createObservable } from '../../other/create-observable';
import { Observable } from '../../types/observable';
import { useSubscriberEffect } from '../use-subscriber-effect';
import { act, render } from '@testing-library/react';

const TestComponent: VFC<{ observable: Observable<number>; cleanupObservable: Observable<number> }> = ({
    observable,
    cleanupObservable,
}) => {
    useSubscriberEffect(
        observable.subscriber,
        useCallback(() => {
            return () => cleanupObservable.dispatch((old) => old + 1);
        }, [])
    );
    return null;
};

it('should be cleaned', function () {
    const cleanupObservable = createObservable(0);
    const observable = createObservable(0);

    render(<TestComponent observable={observable} cleanupObservable={cleanupObservable} />);

    expect(cleanupObservable.subscriber.value()).toBe(0);

    for (let i = 0; i < 10; i++) {
        act(() => observable.dispatch((old) => old + 1));

        expect(cleanupObservable.subscriber.value()).toBe(i + 1);
    }
}); 