import { ISubscriber } from '../types/i-subscriber';
import { Callback } from '../types/callback';
import { CleanupCallback } from '../types/cleanup-callback';

export class Emitter implements ISubscriber<void> {
    private _watching: Callback<void>[];

    constructor() {
        this._watching = [];

        this.subscribe = this.subscribe.bind(this);
        this.emit = this.emit.bind(this);
        this.current = this.current.bind(this);
    }

    emit(): void {
        this._watching.forEach((x) => x());
    }

    current(): void {}

    subscribe(callback: Callback<void>, ignoreFirst: boolean | undefined): CleanupCallback {
        this._watching.push(callback);

        if (!ignoreFirst) callback();

        return () => this._watching.splice(this._watching.indexOf(callback), 1);
    }
}
