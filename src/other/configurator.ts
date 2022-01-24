import {shallowEquals} from '../util/shallow-equals';
import {IConfigurator} from '../types/i-configurator';

export class Configurator<TSource> implements IConfigurator<TSource> {
    private readonly _source: TSource;
    private readonly _stack: any[];
    private _first: boolean;
    private _current: number;

    constructor(source: TSource) {
        this._source = source;
        this._stack = [];
        this._first = true;
        this._current = 0;
    }

    public always(callback: (value: TSource) => void) {
        callback(this._source);
        return this as any;
    }

    public once(callback: (value: TSource) => void) {
        if (!this._first) return;
        callback(this._source);
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

        return this as any;
    }

    public reset() {
        this._first = false;
        this._current = 0;
    }
}
