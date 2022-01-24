import React, { VFC } from 'react';
import { useObservable } from '../use-observable';
import { listen } from '../../components/listen';
import { render } from '@testing-library/react';

const TestComponent: VFC = () => {
    const observable = useObservable(0);

    return (
        <div>
            <div data-testid={0}>{listen(observable, (x) => x)}</div>
            <button data-testid={1} onClick={() => observable.next((old) => old + 1)}>
                increment
            </button>
            <button data-testid={2} onClick={() => observable.next((old) => old - 1)}>
                decrement
            </button>
        </div>
    );
};

it('should sync state', function () {
    const element = render(<TestComponent />);

    const value = element.queryByTestId('0');
    const increment = element.queryByTestId('1');
    const decrement = element.queryByTestId('2');

    expect(value?.textContent).toBe('0');
    increment?.click();
    expect(value?.textContent).toBe('1');
    increment?.click();
    expect(value?.textContent).toBe('2');
    decrement?.click();
    decrement?.click();
    decrement?.click();
    expect(value?.textContent).toBe('-1');
});