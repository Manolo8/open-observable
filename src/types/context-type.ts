import { Observable } from '../other/observable';
import { GlobalObservableKey } from '../other/create-global-observable-key';

export type ContextType = {
    observable: (key: GlobalObservableKey<any>) => Observable<any>;
};
