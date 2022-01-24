import { InitialValue } from '../types/initial-value';

const alreadyTaken = new Set<string>();

function checkTaken(name: string) {
    if (alreadyTaken.has(name)) throw new Error('GlobalKey ' + name + ' already taken!');

    alreadyTaken.add(name);
}

export class GlobalObservableKey<T> {
    private readonly _name: string;
    private readonly _initial: InitialValue<T>;

    constructor(name: string, initial: InitialValue<T>) {
        checkTaken(name);
        this._name = name;
        this._initial = initial;
    }

    public get name(): string {
        return this._name;
    }

    public get initial(): InitialValue<T> {
        return this._initial;
    }
}
