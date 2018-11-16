# use-dotnetify

`useDotnetify` is a React hook that provides pub-sub behavior for [`dotnetify`](http://dotnetify.net/core/overview).

`useReactRouter()` returns an object that contains the state of the `model` name that you would normally provide to `dotnetify.react.connect(...)`.

## Install

You must be using [`dotnetify`](http://dotnetify.net/core/overview).

- `npm install use-dotnetify` or
- `yarn add use-dotnetify`

## Use

```js
import React from "react";
import useDotnetify from "use-dotnetify";

export default function MyApp() {
  const initialState = {
    Greetings: ""
  };

  const state = useDotnetify("HelloWorld", initialState);

  return <div>{state.Greetings}</div>;
}
```
