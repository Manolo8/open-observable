import { useContext } from 'react';
import { GlobalObservableContext } from '../state/global-observable-context';
import { Observable } from '../other/observable';
import { GlobalObservableKey } from '../other/global-observable-key';

export function useGlobalObservable<T>(key: GlobalObservableKey<T>): Observable<T> {
    const context = useContext(GlobalObservableContext);

    return context.observable(key);
}
