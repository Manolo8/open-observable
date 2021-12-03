import { useContext } from 'react';
import { GlobalObservableContext } from '../state/global-observable-context';
import { Observable } from '../other/observable';
import { GlobalObservableKey } from '../other/create-global-observable-key';

export const useGlobalObservable = <T>(key: GlobalObservableKey<T>): Observable<T> => {
    const context = useContext(GlobalObservableContext);

    return context.observable(key);
};
