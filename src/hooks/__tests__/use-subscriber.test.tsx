import React from 'react';
import { useObservable } from '../use-observable';
import { render, fireEvent, act } from '@testing-library/react';
import { Listen } from '../../components/listen';
import { Observable } from '../../other/observable';
import { useSubscriber } from '../use-subscriber';
import { ISubscriber } from '../../types/i-subscriber';

function TestComponent() {
    const observable = useObservable(0);

    return (
        <div>
            <div data-testid={0}>
                <Listen subscriber={observable}>{(value) => value}</Listen>
            </div>
            <button data-testid={1} onClick={() => observable.next((old) => old + 1)}>
                increment
            </button>
            <button data-testid={2} onClick={() => observable.next((old) => old - 1)}>
                decrement
            </button>
        </div>
    );
}

it('should sync state', function () {
    const element = render(<TestComponent />);

    const value = element.queryByTestId('0');
    const increment = element.queryByTestId('1');
    const decrement = element.queryByTestId('2');

    expect(value?.textContent).toBe('0');
    fireEvent.click(increment!);
    expect(value?.textContent).toBe('1');
    fireEvent.click(increment!);
    expect(value?.textContent).toBe('2');
    fireEvent.click(decrement!);
    fireEvent.click(decrement!);
    fireEvent.click(decrement!);
    expect(value?.textContent).toBe('-1');
});

function FunctionComponent({ subscriber }: { subscriber: ISubscriber<() => number> }) {
    const value = useSubscriber(subscriber);

    return <div data-testid={0}>{value()}</div>;
}

it('should keep function values intact', function () {
    const observable = new Observable<() => number>(() => () => 1);

    const element = render(<FunctionComponent subscriber={observable} />);

    const value = element.queryByTestId('0');

    expect(value?.textContent).toBe('1');

    act(() => observable.next(() => () => 2));
    expect(value?.textContent).toBe('2');

    act(() => observable.next(() => () => 3));
    expect(value?.textContent).toBe('3');
});
