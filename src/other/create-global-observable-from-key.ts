import { Observable } from './observable';
import { GlobalObservableKey } from './global-observable-key';
import { InitialValue } from '../types/initial-value';

function updateValue<T>(key: string, value: T, version: number) {
    localStorage.setItem(key, JSON.stringify({ version, value }));
}

function restoreValue<T>(key: string, defaultValue: InitialValue<T>, version: number): T | InitialValue<T> {
    const itemStr = localStorage.getItem(key);

    if (itemStr) {
        const parsed = JSON.parse(itemStr);

        if (parsed && parsed.version === version) return parsed.value;
    }

    return defaultValue;
}

export function createGlobalObservableFromKey<T>(key: GlobalObservableKey<T>): Observable<T> {
    const value = key.storage ? restoreValue(key.name, key.initial, key.storage.version) : key.initial;

    const observable = new Observable<T>(value);

    if (key.storage) {
        const storage = key.storage;
        observable.subscribe((value) => updateValue(key.name, value, storage.version ?? 0), true);
    }

    return observable;
}
