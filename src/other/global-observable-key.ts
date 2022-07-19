import { InitialValue } from '../types/initial-value';
import { GlobalObservableStorage } from '../types/global-observable-storage';

const alreadyTaken = new Set<string>();

function checkTaken(name: string) {
    if (alreadyTaken.has(name)) throw new Error('GlobalKey ' + name + ' already taken!');

    alreadyTaken.add(name);
}

export class GlobalObservableKey<T> {
    private readonly _name: string;
    private readonly _initial: InitialValue<T>;
    private readonly _storage?: GlobalObservableStorage;

    constructor(name: string, initial: InitialValue<T>, storage?: GlobalObservableStorage) {
        checkTaken(name);
        this._name = name;
        this._initial = initial;
        this._storage = storage;
    }

    public get name(): string {
        return this._name;
    }

    public get initial(): InitialValue<T> {
        return this._initial;
    }

    public get storage(): GlobalObservableStorage | undefined {
        return this._storage;
    }
}
