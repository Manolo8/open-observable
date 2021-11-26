import React,{VFC} from "react";
import {useObservable} from "./use-observable";
import {listen} from "../components/listen";

const CountingExample: VFC = () => {

    const observable = useObservable(0);

    return (
        <div>
            <div>
                Current value is: {listen(observable.subscriber, x => x)}
            </div>
            <button onClick={() => observable.dispatch(old => old +1)}>
                Click
            </button>
        </div>
    )
}