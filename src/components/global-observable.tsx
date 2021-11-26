import React, { FC, useCallback, useRef } from 'react';
import { GlobalObservableContext } from '../state/global-observable-context';
import { Observable } from '../types/observable';
import { GlobalObservableKey } from '../types/global-observable-key';
import { createObservable } from '../other/create-observable';

export const GlobalObservable: FC = ({ children }) => {
    const valuesRef = useRef<Record<string, Observable<any>>>({});

    const observable = useCallback((key: GlobalObservableKey<any>) => {
        let value = valuesRef.current[key.name];

        if (!value) value = valuesRef.current[key.name] = createObservable(key.initialValue);

        return value;
    }, []);

    return <GlobalObservableContext.Provider value={{ observable }}>{children}</GlobalObservableContext.Provider>;
};