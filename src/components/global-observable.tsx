import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GlobalObservableKey } from '../other/global-observable-key';
import { Observable } from '../other/observable';
import { GlobalObservableContext } from '../state/global-observable-context';
import { InitialValue } from '../types/initial-value';

interface Props {
    children: React.ReactNode;
}

function storageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
}

function updateValue<T>(key: string, value: T, version: number) {
    if (!storageAvailable()) return;

    try {
        localStorage.setItem(key, JSON.stringify({ version, value }));
    } catch (e) {
        // persistence is best-effort (quota exceeded, storage disabled, ...)
    }
}

function restoreValue<T>(key: string, defaultValue: InitialValue<T>, version: number): T | InitialValue<T> {
    if (!storageAvailable()) return defaultValue;

    try {
        const itemStr = localStorage.getItem(key);

        if (itemStr) {
            const parsed = JSON.parse(itemStr);

            if (parsed && parsed.version === version) return parsed.value;
        }
    } catch (e) {
        try {
            localStorage.removeItem(key);
        } catch (e2) {
            // ignore
        }
    }

    return defaultValue;
}

type ObservableWithKey = { key: GlobalObservableKey<any>; observable: Observable<any> };

export function GlobalObservable({ children }: Props) {
    const [mounted, setMounted] = useState(false);
    const valuesRef = useRef<Map<string, ObservableWithKey>>(new Map<any, any>());
    const cleanupsRef = useRef<(() => void)[]>([]);

    useEffect(() => {
        setMounted(true);

        const map = valuesRef.current;
        const iterator = map.values();

        let next = iterator.next();

        const cleanups: (() => void)[] = [];

        while (!next.done) {
            const observableWithKey = next.value;
            const observable = observableWithKey.observable;
            const key = observableWithKey.key;

            if (key.storage?.store) {
                const value = restoreValue(key.name, key.initial, key.storage.version);

                observable.next(value);

                const cleanup = observable.subscribe((value) => {
                    updateValue(key.name, value, key.storage!.version);
                }, true);

                cleanups.push(cleanup);
            }

            next = iterator.next();
        }

        return () => {
            cleanups.forEach((c) => c());
            cleanupsRef.current.forEach((c) => c());
            cleanupsRef.current = [];
            setMounted(false);
        };
    }, []);

    const observableFactory = useCallback(
        (key: GlobalObservableKey<any>) => {
            let observableWithKey = valuesRef.current.get(key.name);

            if (!observableWithKey) {
                let initial = key.initial;

                if (mounted && key.storage?.store) {
                    initial = restoreValue(key.name, key.initial, key.storage.version);
                }

                const observable = new Observable<any>(initial);

                if (mounted && key.storage?.store) {
                    const cleanup = observable.subscribe((value) => {
                        updateValue(key.name, value, key.storage!.version);
                    }, true);

                    cleanupsRef.current.push(cleanup);
                }

                observableWithKey = { key, observable };

                valuesRef.current.set(key.name, observableWithKey);
            }

            return observableWithKey.observable;
        },
        [mounted]
    );

    return <GlobalObservableContext.Provider value={observableFactory}>{children}</GlobalObservableContext.Provider>;
}
