import {useState} from 'react';
import {Observable} from '../other/observable';

export const useObservable = <T>(initial: T | (() => T)) => {
    const [observable] = useState(() => new Observable(initial));

    return observable;
};
