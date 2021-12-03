import React, { ReactElement, VFC } from 'react';
import { useSubscriber } from '../hooks/use-subscriber';
import { ISubscribable } from '../types/i-subscribable';

type Props = { subscriber: ISubscribable<any>; render: (value: any) => ReactElement };
export const Listen: VFC<Props> = ({ subscriber, render }) => {
    const value = useSubscriber(subscriber);

    return render(value);
};

export const listen = <T,>(subscriber: ISubscribable<T>, render: (value: T) => ReactElement) => {
    return <Listen subscriber={subscriber} render={render} />;
};