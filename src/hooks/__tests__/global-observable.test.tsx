import { render, fireEvent } from '@testing-library/react';
import React, { useState, VFC } from 'react';
import { GlobalObservable } from '../../components/global-observable';
import { GlobalObservableKey } from '../../other/global-observable-key';
import { Observable } from '../../other/observable';
import { useGlobalObservable } from '../use-global-observable';

const corruptedKey = new GlobalObservableKey<number>('global-observable-corrupted', 10, { store: true, version: 1 });
const restoreKey = new GlobalObservableKey<number>('global-observable-restore', 1, { store: true, version: 2 });
const mountedKey = new GlobalObservableKey<number>('global-observable-leak-mounted', 1, { store: true, version: 1 });
const lateKey = new GlobalObservableKey<number>('global-observable-leak-late', 1, { store: true, version: 1 });

interface CaptureProps {
    observableKey: GlobalObservableKey<number>;
    onReady: (observable: Observable<number>) => void;
}

const Capture: VFC<CaptureProps> = ({ observableKey, onReady }) => {
    const $value = useGlobalObservable(observableKey);

    onReady($value);

    return null;
};

beforeEach(() => {
    localStorage.clear();
});

it('should not throw when the stored value is corrupted and should use the default value', () => {
    localStorage.setItem(corruptedKey.name, '{not json');

    let observable: Observable<number> | undefined;

    const element = render(
        <GlobalObservable>
            <Capture observableKey={corruptedKey} onReady={(o) => (observable = o)} />
        </GlobalObservable>
    );

    expect(observable).toBeDefined();
    expect(observable!.current()).toBe(10);

    element.unmount();
});

it('should restore a stored value with a matching version', () => {
    localStorage.setItem(restoreKey.name, JSON.stringify({ version: 2, value: 42 }));

    let observable: Observable<number> | undefined;

    const element = render(
        <GlobalObservable>
            <Capture observableKey={restoreKey} onReady={(o) => (observable = o)} />
        </GlobalObservable>
    );

    expect(observable!.current()).toBe(42);

    element.unmount();
});

it('should not leak storage subscriptions after unmount', () => {
    let mountedObservable: Observable<number> | undefined;
    let lateObservable: Observable<number> | undefined;

    function Wrapper() {
        const [showLate, setShowLate] = useState(false);

        return (
            <GlobalObservable>
                <Capture observableKey={mountedKey} onReady={(o) => (mountedObservable = o)} />
                {showLate && <Capture observableKey={lateKey} onReady={(o) => (lateObservable = o)} />}
                <button data-testid="show-late" onClick={() => setShowLate(true)} />
            </GlobalObservable>
        );
    }

    const element = render(<Wrapper />);

    // creates an observable after the provider is mounted (factory subscription path)
    fireEvent.click(element.getByTestId('show-late'));

    expect(mountedObservable).toBeDefined();
    expect(lateObservable).toBeDefined();

    element.unmount();

    const setItem = jest.spyOn(Storage.prototype, 'setItem');

    try {
        mountedObservable!.next(99);
        lateObservable!.next(99);

        expect(setItem).not.toHaveBeenCalled();
    } finally {
        setItem.mockRestore();
    }
});
