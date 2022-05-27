import React, {FC, ReactNode} from 'react';
import {useSubscriber} from '../hooks/use-subscriber';
import {ISubscriber} from '../types/i-subscriber';

type Props = { subscriber: ISubscriber<any>; render: (value: any) => ReactNode };
export const Listen: FC<Props> = ({subscriber, render}) => {
    const value = useSubscriber(subscriber);

    return (render(value) as any) ?? null;
};

export const listen = <T, >(subscriber: ISubscriber<T>, render: (value: T) => ReactNode) => {
    return <Listen subscriber={subscriber} render={render}/>;
};
