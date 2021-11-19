import { createObservable } from '../create-observable';

it('should dispatch correctly', function () {
    const observable = createObservable(1);

    expect(observable.subscriber.value()).toBe(1);

    [1, 2, 3, 4, 5, 6, 7, 8].forEach((value, i) => {
        observable.dispatch(i);
        expect(observable.subscriber.value()).toBe(i);
    });
});

it('should listen correctly', function () {
    const initial = 1;
    const observable = createObservable(initial);

    const data = [9, 3, 5, 10, 25];

    let i = -1;
    const cleanup = observable.subscriber.subscribe((val, prev) => {
        if (i === -1) {
            expect(val).toBe(initial);
            expect(prev).toBeUndefined();
        } else {
            expect(prev).toBe(i === 0 ? initial : data[i - 1]);
            expect(val).toBe(data[i]);
        }
        i++;
    }, true);

    data.forEach(observable.dispatch);
    expect(cleanup).not.toBeNull();

    cleanup();
});