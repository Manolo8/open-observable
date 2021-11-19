import { createGlobalObservableKey } from '../create-global-observable-key';

it('should create an global observable key', function () {
    const key = createGlobalObservableKey('test', 1);

    expect(key.name).toBe('test');
    expect(key.initialValue).toBe(1);
});