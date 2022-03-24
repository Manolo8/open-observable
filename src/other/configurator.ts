import {IConfigurator} from '../types/i-configurator';
import {shallowEquals} from '../util/shallow-equals';

export class Configurator<TSource> implements IConfigurator<TSource> {
    private readonly _source: TSource;
    private readonly _stack: any[];
    private _first: boolean;
    private _current: number;
    private _called: boolean;

    constructor(source: TSource) {
        this._source = source;
        this._stack = [];
        this._first = true;
        this._current = 0;
        this._called = false;
    }

    public once(callback: (value: TSource) => void) {
        if (!this._first) return;
        callback(this._source);
        this._called = true;
        return this as any;
    }

    public on(deps: any[], callback: (value: TSource) => void) {
        const current = this._current;
        const lastDeps = this._stack[current];
        this._current++;

        if (lastDeps) {
            if (lastDeps.length !== deps.length) throw new Error('Deps length mismatch');

            if (shallowEquals(lastDeps, deps)) return;
        }

        this._stack[current] = deps;
        callback(this._source);
        this._called = true;
        return this as any;
    }

    public reset() {
        this._first = false;
        this._called = false;
        this._current = 0;
    }

    public isCalled(): boolean {
        return this._called;
    }
}