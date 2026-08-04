import { Observable } from '../other/observable';
import { GlobalObservableKey } from '../other/global-observable-key';

export type ContextType = (key: GlobalObservableKey<any>) => Observable<any>;
