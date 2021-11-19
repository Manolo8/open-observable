import { useMemo } from 'react';
import { createObservable } from '../other/create-observable';
import { Equality } from '../types/equality';

export const useObservable = <T>(initial: T | (() => T), equality: Equality | null = null) => {
    return useMemo(() => {
        return createObservable(typeof initial === 'function' ? (initial as () => T)() : initial, equality);
    }, []);
};