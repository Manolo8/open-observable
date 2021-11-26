import { GlobalObservableKey } from '../types/global-observable-key';
import { useContext } from 'react';
import { GlobalObservableContext } from '../state/global-observable-context';
import { Observable } from '../types/observable';

export const useGlobalObservable = <T>(key: GlobalObservableKey<T>): Observable<T> => {
    const context = useContext(GlobalObservableContext);

    return context.observable(key);
};