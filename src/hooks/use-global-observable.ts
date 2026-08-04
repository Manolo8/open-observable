import { useContext } from 'react';
import { GlobalObservableKey } from '../other/global-observable-key';
import { Observable } from '../other/observable';
import { GlobalObservableContext } from '../state/global-observable-context';

export function useGlobalObservable<T>(key: GlobalObservableKey<T>): Observable<T> {
    const context = useContext(GlobalObservableContext);

    return context(key);
}
