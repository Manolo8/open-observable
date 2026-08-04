import { render, fireEvent, act } from '@testing-library/react';
import React, { useCallback, useEffect } from 'react';
import { Listen } from '../../components/listen';
import { Observable } from '../../other/observable';
import { useSubscriberGroup } from '../use-subscriber-group';


function TestComponent() {
    const observable1 = new Observable(1);



    return (
        <div>
            <div data-testid={0}>
                <Listen subscriber={observable1}>{(value) => value}</Listen>
            </div>
            <button data-testid={1} onClick={() => observable1.next((old) => old + 1)}>
                increment
            </button>
            <button data-testid={2} onClick={() => observable1.next((old) => old - 1)}>
                decrement
            </button>
        </div>
    );
}

it('should use 3 observables', () => {
    const element = render(<TestComponent />);

    const value = element.queryByTestId('0');
    const increment = element.queryByTestId('1');
    const decrement = element.queryByTestId('2');

    expect(value?.textContent).toBe('1');

    fireEvent.click(increment!);    
    expect(value?.textContent).toBe('2');
    fireEvent.click(increment!);
    expect(value?.textContent).toBe('3');
});

interface GroupProps {
    observable1: Observable<number>;
    observable2: Observable<number>;
    onMount?: () => void;
}

//child effects flush before the parent ones, so this changes an observable
//after the first render but before the group subscribes to it
function Bumper({ onMount }: { onMount?: () => void }) {
    useEffect(() => {
        if (onMount) onMount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
}

function GroupComponent({ observable1, observable2, onMount }: GroupProps) {
    const group = useSubscriberGroup(observable1, observable2);

    return (
        <div>
            <Bumper onMount={onMount} />
            <div data-testid={0}>
                <Listen subscriber={group}>{(value) => value.join(',')}</Listen>
            </div>
        </div>
    );
}

it('should reflect current values on mount', () => {
    const observable1 = new Observable(1);
    const observable2 = new Observable(2);

    const element = render(
        <GroupComponent observable1={observable1} observable2={observable2} onMount={() => observable1.next(10)} />
    );

    const value = element.queryByTestId('0');

    //the change happened while the group was not subscribed yet
    expect(value?.textContent).toBe('10,2');

    act(() => observable2.next(20));
    expect(value?.textContent).toBe('10,20');
});
