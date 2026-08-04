# OpenObservable

A hook library for subscriber data

## Hooks

-   useObservable
-   useSubscriber
-   useSubscriberSelector
-   useSubscriberSelectorAsSubscriber
-   useSubscriberEffect
-   useGlobalObservable
-   useAnySubscriberChangeEffect
-   useEmitter
-   useSubscriberGroup

## Components

-   Listen
-   GlobalObservable

## Examples

```tsx
import { Listen, useObservable } from 'open-observable';

const CountingExample: VFC = () => {
    const observable = useObservable(0);

    //only the Listen block rerenders
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                Current value is: <Listen subscriber={observable.asSubscriber()}>{(value) => value}</Listen>
            </div>
            <button onClick={() => observable.next((old) => old + 1)}>Click</button>
        </div>
    );
};
```

```tsx
import { ISubscriber, useObservable, useSubscriber } from 'open-observable';

const PassingToChildren: VFC = () => {
    const observable = useObservable('testing');

    return <Children _value={observable.asSubscriber()} />;
};

type ChildrenProps = { _value: ISubscriber<string> };

const Children: VFC<ChildrenProps> = ({ _value }) => {
    const value = useSubscriber(_value);

    return <div>{value}</div>;
};
```

```tsx
import { GlobalObservable, GlobalObservableKey, Listen, useGlobalObservable } from 'open-observable';

//keys are created once, outside of the components, and the name must be unique
const themeKey = new GlobalObservableKey<string>('theme', 'light', { store: true, version: 1 });

const App: VFC = () => (
    <GlobalObservable>
        <ThemeSwitch />
    </GlobalObservable>
);

const ThemeSwitch: VFC = () => {
    const theme = useGlobalObservable(themeKey);

    return (
        <button onClick={() => theme.next((old) => (old === 'light' ? 'dark' : 'light'))}>
            <Listen subscriber={theme.asSubscriber()}>{(value) => value}</Listen>
        </button>
    );
};
```

Caution: with `{ store: true }` the value is persisted as plaintext in `localStorage`, so do not persist secrets.
