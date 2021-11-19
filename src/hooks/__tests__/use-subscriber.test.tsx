import { act, render, screen } from '@testing-library/react';
import React, { VFC } from 'react';
import { Observable } from '../../types/observable';
import { createObservable } from '../../other/create-observable';
import { useSubscriber } from '../use-subscriber';

const TestComponent: VFC<{ observable: Observable<string> }> = ({ observable }) => {
    const value = useSubscriber(observable.subscriber);

    return <span data-testid='value'>{value}</span>;
};

it('given an observable, the text should update when te value changes', function () {
    const observable = createObservable('0');

    render(<TestComponent observable={observable} />);

    expect(screen.getByTestId('value').innerHTML).toBe('0');

    ['test1', 'test2', 'test3'].forEach((value) => {
        act(() => observable.dispatch(value));
        expect(screen.getByTestId('value').innerHTML).toBe(value);
    });
});
