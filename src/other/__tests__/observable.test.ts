import { Observable } from '../observable';

it('should dispatch correctly', function () {
    const observable = new Observable(1);

    expect(observable.current()).toBe(1);

    [1, 2, 3, 4, 5, 6, 7, 8].forEach((value, i) => {
        observable.next(i);
        expect(observable.current()).toBe(i);
    });
});

it('should listen correctly', function () {
    const initial = 1;
    const observable = new Observable(initial);

    const data = [9, 3, 5, 10, 25];

    let i = -1;
    const cleanup = observable.subscribe((val, prev) => {
        if (i === -1) {
            expect(val).toBe(initial);
            expect(prev).toBeUndefined();
        } else {
            expect(prev).toBe(i === 0 ? initial : data[i - 1]);
            expect(val).toBe(data[i]);
        }
        i++;
    }, false);

    data.forEach(observable.next);
    expect(cleanup).not.toBeNull();

    cleanup();
});

it('should listen correctly ignoring first', function () {
    const initial = 1;
    const observable = new Observable(initial);

    const data = [9, 3, 5, 10, 25];

    let i = 0;
    const cleanup = observable.subscribe((val, prev) => {
        expect(prev).toBe(i === 0 ? initial : data[i - 1]);
        expect(val).toBe(data[i]);
        i++;
    }, true);

    data.forEach(observable.next);
    expect(cleanup).not.toBeNull();

    cleanup();
});

it('should cleanup correctly', function () {
    const observable = new Observable(0);

    expect(observable.watchingCount()).toBe(0);

    const cleanup = observable.subscribe(() => {});

    expect(observable.watchingCount()).toBe(1);

    cleanup();

    expect(observable.watchingCount()).toBe(0);
});

it('should not remove other subscribers when cleanup is called twice', function () {
    const observable = new Observable(0);

    const first: number[] = [];
    const second: number[] = [];

    const cleanupFirst = observable.subscribe((val) => first.push(val), true);
    observable.subscribe((val) => second.push(val), true);

    expect(observable.watchingCount()).toBe(2);

    cleanupFirst();
    cleanupFirst();

    expect(observable.watchingCount()).toBe(1);

    observable.next(1);

    expect(first).toEqual([]);
    expect(second).toEqual([1]);
});

it('should notify every subscriber even when one unsubscribes itself while notifying', function () {
    const observable = new Observable(0);

    const notified: string[] = [];

    observable.subscribe(() => notified.push('first'), true);

    let cleanupSecond: () => void;

    cleanupSecond = observable.subscribe(() => {
        notified.push('second');
        cleanupSecond();
    }, true);

    observable.subscribe(() => notified.push('third'), true);

    observable.next(1);

    expect(notified).toEqual(['first', 'second', 'third']);
    expect(observable.watchingCount()).toBe(2);

    observable.next(2);

    expect(notified).toEqual(['first', 'second', 'third', 'first', 'third']);
});