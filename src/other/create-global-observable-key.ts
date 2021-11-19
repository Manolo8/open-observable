import { GlobalObservableKey } from '../types/global-observable-key';

export const createGlobalObservableKey = <E>(name: string, initialValue: E): GlobalObservableKey<E> => {
    return {
        name,
        initialValue,
    };
};