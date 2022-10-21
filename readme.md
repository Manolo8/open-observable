# OpenObservable

A hook library for subscriber data

## Installation

with npm

```bash
  npm install open-observable
```
Or with yarn
```bash
  yarn add open-observable
```

## Setup 

In the index.js file, wrap your components with GlobalObservable to recognize the observables

``` javascript
root.render(
    <React.StrictMode>
        <GlobalObservable>
            <App />
        </GlobalObservable>
    </React.StrictMode>
);
```

## Hooks

-   useObservable
-   useSubscriber
-   useSubscriberSelector
-   useSubscriberSelectorAsSubscriber
-   useSubscriberEffect
-   useGlobalObservable
-   useAnySubscriberChangeEffect

## Components

-   GlobalObservable
-   Listen

# Methods

-   createGlobalObservableKey
-   listen

## Examples

```tsx
const CountingExample: VFC = () => {
    const observable = useObservable(0);
    //Only rerender the listen block
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>Current value is: {listen(observable.subscriber, (x) => x)}</div>
            <button onClick={() => observable.next((old) => old + 1)}>Click</button>
        </div>
    );
};
```

```tsx
const PassingToChildren: VFC = () => {
    const observable = useObservable('testing');

    return <Children _value={observable.subscriber} />;
};

type ChildrenProps = { _value: Subscriber<string> };
const Children: VFC<ChildrenProps> = ({ _value }) => {
    const value = useSubscriber(_value);

    return <div>{value}</div>;
};
```
