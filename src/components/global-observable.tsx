import React, { FC, PropsWithChildren, useCallback, useRef } from 'react';
import { GlobalObservableContext } from '../state/global-observable-context';
import { Observable } from '../other/observable';
import { GlobalObservableKey } from '../other/global-observable-key';

export const GlobalObservable: FC<PropsWithChildren<{}>> = ({ children }) => {
    const valuesRef = useRef<Record<string, Observable<any>>>({});

    const observable = useCallback((key: GlobalObservableKey<any>) => {
        let value = valuesRef.current[key.name];

        if (!value) value = valuesRef.current[key.name] = new Observable<any>(key.initial);

        return value;
    }, []);

    return <GlobalObservableContext.Provider value={{ observable }}>{children}</GlobalObservableContext.Provider>;
};
