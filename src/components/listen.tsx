import React, { ReactNode, VFC } from 'react';
import { Subscriber } from '../types/subscriber';
import { useSubscriber } from '../hooks/use-subscriber';

type Props = { subscriber: Subscriber<any>; render: (value: any) => ReactNode };
export const Listen: VFC<Props> = ({ subscriber, render }) => {
    const value = useSubscriber(subscriber);

    return render(value);
};

export const listen = <T extends any>(subscriber: Subscriber<T>, render: (value: T) => ReactNode) => {
    return <Listen subscriber={subscriber} render={render} />;
};