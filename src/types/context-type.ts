import { Observable } from './observable';
import { GlobalObservableKey } from './global-observable-key';

export type ContextType = {
    observable: (key: GlobalObservableKey<any>) => Observable<any>;
};