import { render, fireEvent } from '@testing-library/react';
import React, { useCallback } from 'react';
import { Listen } from '../../components/listen';
import { GlobalObservable } from '../../components/global-observable';
import { GlobalObservableKey } from '../../other/global-observable-key';
import { useGlobalObservable } from '../use-global-observable';

const key = new GlobalObservableKey<number>('test', 1, { store: true, version: 1 });

function Wrapper() {
    return (
        <GlobalObservable>
            <TestComponent />
        </GlobalObservable>
    );
}

function TestComponent() {
    const $value = useGlobalObservable(key);

    return (
        <div>
            <div data-testid={0}>
                <Listen subscriber={$value}>{(value) => value}</Listen>
            </div>
            <button data-testid={1} onClick={() => $value.next((old) => old + 1)} />
        </div>
    );
}

it('should use 3 observables', () => {
    const element = render(<Wrapper />);

    const value = element.queryByTestId('0');
    const increment = element.queryByTestId('1');

    expect(value!.textContent).toBe('1');

    fireEvent.click(increment!);
    expect(value?.textContent).toBe('2');
    fireEvent.click(increment!);
    expect(value?.textContent).toBe('3');

    element.unmount();

    const newElement = render(<Wrapper />);

    const newValue = newElement.queryByTestId('0');

    expect(newValue!.textContent).toBe('3');
});
