import { ISubscriber } from '../types/i-subscriber';
import { Callback } from '../types/callback';
import { CleanupCallback } from '../types/cleanup-callback';

export class Emitter implements ISubscriber<void> {
    private _watching: Callback<void>[];
    //how many emits are iterating _watching right now, nested ones included
    private _emitting: number;

    constructor() {
        this._watching = [];
        this._emitting = 0;

        this.subscribe = this.subscribe.bind(this);
        this.emit = this.emit.bind(this);
        this.current = this.current.bind(this);
    }

    emit(): void {
        const watching = this._watching;

        this._emitting++;

        try {
            for (let i = 0; i < watching.length; i++) {
                watching[i]();
            }
        } finally {
            this._emitting--;
        }
    }

    current(): void {}

    subscribe(callback: Callback<void>, ignoreFirst: boolean | undefined): CleanupCallback {
        //an emit is iterating the array, copy it so the running loop keeps its snapshot
        if (this._emitting > 0) this._watching = this._watching.slice();

        this._watching.push(callback);

        if (!ignoreFirst) callback();

        return () => {
            const index = this._watching.indexOf(callback);

            if (index < 0) return;

            if (this._emitting > 0) this._watching = this._watching.slice();

            this._watching.splice(index, 1);
        };
    }
}
