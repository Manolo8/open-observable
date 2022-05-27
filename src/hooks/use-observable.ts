import { useState } from 'react';
import { Observable } from '../other/observable';

export function useObservable<T>(initial: T | (() => T)): Observable<T> {
    const [observable] = useState(() => new Observable(initial));

    return observable;
}
