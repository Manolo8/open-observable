import React, { Fragment, VFC } from 'react';
import { createGlobalObservableKey } from '../../other/create-global-observable-key';
import { GlobalObservableKey } from '../../types/global-observable-key';
import { useGlobalObservable } from '../../hooks/use-global-observable';
import { useSubscriber } from '../../hooks/use-subscriber';
import { render, screen } from '@testing-library/react';
import { GlobalObservable } from '../global-observable';

const key = createGlobalObservableKey('test', 0);
const key2 = createGlobalObservableKey('test2', 0);

const TestComponent: VFC<{ name: string; valKey: GlobalObservableKey<number> }> = ({ name, valKey }) => {
    const observable = useGlobalObservable(valKey);
    const value = useSubscriber(observable.subscriber);

    return (
        <Fragment>
            <p data-testid={name}>{value}</p>
            <button type='button' data-testid={name + '_increment'} onClick={() => observable.dispatch((x) => x + 1)}>
                Increment
            </button>
        </Fragment>
    );
};

it('giver global observable keys, values must maintain synchronization', function () {
    const values = [4, 5, 7, 1, 4, 6, 8, 1];

    render(
        <GlobalObservable>
            <TestComponent name='test1' valKey={key} />
            <TestComponent name='test2' valKey={key2} />
        </GlobalObservable>
    );

    const test1Val = screen.getByTestId('test1');
    const test1Increment = screen.getByTestId('test1_increment');
    const test2Val = screen.getByTestId('test2');
    const test2Increment = screen.getByTestId('test2_increment');

    expect(test1Val.innerHTML).toBe('0');
    expect(test2Val.innerHTML).toBe('0');

    test1Increment.click();
    test1Increment.click();

    test2Increment.click();

    expect(test1Val.innerHTML).toBe('2');
    expect(test2Val.innerHTML).toBe('1');
});
