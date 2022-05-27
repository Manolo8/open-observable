import { Configurator } from '../configurator';

it('should call correctly', function () {
    const configurator = new Configurator({});

    expect(configurator.isCalled()).toBeFalsy();

    configurator.once(() => {});
    configurator.on([1, 2, 3], () => {});

    expect(configurator.isCalled()).toBeTruthy();

    configurator.reset();

    expect(configurator.isCalled()).toBeFalsy();

    configurator.once(() => {});
    configurator.on([1, 2, 3], () => {});

    expect(configurator.isCalled()).toBeFalsy();

    configurator.reset();

    configurator.once(() => {});
    configurator.on([1, 2, 2], () => {});

    expect(configurator.isCalled()).toBeTruthy();
});
